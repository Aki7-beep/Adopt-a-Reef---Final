<?php

declare(strict_types=1);

final class Storage
{
    private const EXPENSE_CATEGORIES = [
        ['id' => 'restoration', 'label' => 'Coral Restoration', 'percent' => 45, 'color' => '#21bcee'],
        ['id' => 'cleanup', 'label' => 'Reef Cleanup', 'percent' => 25, 'color' => '#116bf8'],
        ['id' => 'education', 'label' => 'Marine Education', 'percent' => 15, 'color' => '#7c3aed'],
        ['id' => 'equipment', 'label' => 'Equipment & Boats', 'percent' => 10, 'color' => '#f59e0b'],
        ['id' => 'operations', 'label' => 'Operations', 'percent' => 5, 'color' => '#94a3b8'],
    ];

    public static function getUser(string $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? map_user_row($row) : null;
    }

    public static function getUserByUsername(string $username): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        return $row ? map_user_row($row) : null;
    }

    public static function getAllUsers(): array
    {
        $rows = Database::connection()->query('SELECT * FROM users ORDER BY username')->fetchAll();
        return array_map('map_user_row', $rows);
    }

    public static function createUser(array $data): array
    {
        $id = uuid_v4();
        $stmt = Database::connection()->prepare(
            'INSERT INTO users (id, username, password, is_admin, first_name, last_name, email)
             VALUES (?, ?, ?, ?, ?, ?, ?)',
        );
        $stmt->execute([
            $id,
            $data['username'],
            $data['password'],
            !empty($data['isAdmin']) ? 1 : 0,
            $data['firstName'] ?? null,
            $data['lastName'] ?? null,
            $data['email'] ?? null,
        ]);
        return self::getUser($id);
    }

    public static function getAllCorals(): array
    {
        $rows = Database::connection()->query('SELECT * FROM corals ORDER BY name')->fetchAll();
        return array_map('map_coral_row', $rows);
    }

    public static function getCoral(string $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM corals WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? map_coral_row($row) : null;
    }

    public static function createCoral(array $data): array
    {
        $id = uuid_v4();
        $stmt = Database::connection()->prepare(
            'INSERT INTO corals (id, name, image, description, price, stock) VALUES (?, ?, ?, ?, ?, ?)',
        );
        $stmt->execute([
            $id,
            $data['name'],
            $data['image'],
            $data['description'] ?? '',
            (int) $data['price'],
            (int) $data['stock'],
        ]);
        return self::getCoral($id);
    }

    public static function updateCoral(string $id, array $updates): ?array
    {
        $existing = self::getCoral($id);
        if (!$existing) {
            return null;
        }
        $merged = array_merge($existing, $updates);
        $stmt = Database::connection()->prepare(
            'UPDATE corals SET name = ?, image = ?, description = ?, price = ?, stock = ? WHERE id = ?',
        );
        $stmt->execute([
            $merged['name'],
            $merged['image'],
            $merged['description'],
            (int) $merged['price'],
            (int) $merged['stock'],
            $id,
        ]);
        return self::getCoral($id);
    }

    public static function deleteCoral(string $id): bool
    {
        $stmt = Database::connection()->prepare('DELETE FROM corals WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    /** @return array{ok: bool, adoption?: array, reason?: string} */
    public static function createAdoption(string $userId, string $coralId, int $amount): array
    {
        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare('SELECT * FROM corals WHERE id = ? FOR UPDATE');
            $stmt->execute([$coralId]);
            $row = $stmt->fetch();
            if (!$row) {
                $pdo->rollBack();
                return ['ok' => false, 'reason' => 'not_found'];
            }
            if ((int) $row['stock'] < $amount) {
                $pdo->rollBack();
                return ['ok' => false, 'reason' => 'out_of_stock'];
            }
            $pdo->prepare('UPDATE corals SET stock = stock - ? WHERE id = ?')->execute([$amount, $coralId]);

            $id = uuid_v4();
            $pdo->prepare(
                'INSERT INTO adoptions (id, user_id, coral_id, coral_name, coral_image, amount, price)
                 VALUES (?, ?, ?, ?, ?, ?, ?)',
            )->execute([
                $id,
                $userId,
                $coralId,
                $row['name'],
                $row['image'],
                $amount,
                (int) $row['price'],
            ]);
            $pdo->commit();
            $stmt = $pdo->prepare('SELECT * FROM adoptions WHERE id = ?');
            $stmt->execute([$id]);
            return ['ok' => true, 'adoption' => map_adoption_row($stmt->fetch())];
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function getAdoptionsByUserId(string $userId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM adoptions WHERE user_id = ? ORDER BY adopted_at DESC',
        );
        $stmt->execute([$userId]);
        return array_map('map_adoption_row', $stmt->fetchAll());
    }

    public static function getAllAdoptions(): array
    {
        $rows = Database::connection()->query('SELECT * FROM adoptions ORDER BY adopted_at DESC')->fetchAll();
        return array_map('map_adoption_row', $rows);
    }

    public static function deleteAdoption(string $userId, string $adoptionId): bool
    {
        $stmt = Database::connection()->prepare(
            'DELETE FROM adoptions WHERE id = ? AND user_id = ?',
        );
        $stmt->execute([$adoptionId, $userId]);
        return $stmt->rowCount() > 0;
    }

    public static function createDonation(string $userId, array $data): array
    {
        $id = uuid_v4();
        $stmt = Database::connection()->prepare(
            'INSERT INTO donations (id, user_id, amount, donor_name, donor_email) VALUES (?, ?, ?, ?, ?)',
        );
        $stmt->execute([
            $id,
            $userId,
            (int) $data['amount'],
            $data['donorName'] ?? null,
            !empty($data['donorEmail']) ? $data['donorEmail'] : null,
        ]);
        $row = Database::connection()->prepare('SELECT * FROM donations WHERE id = ?');
        $row->execute([$id]);
        return map_donation_row($row->fetch());
    }

    public static function getDonationsByUserId(string $userId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM donations WHERE user_id = ? ORDER BY donated_at DESC',
        );
        $stmt->execute([$userId]);
        return array_map('map_donation_row', $stmt->fetchAll());
    }

    public static function getAllDonations(): array
    {
        $rows = Database::connection()->query('SELECT * FROM donations ORDER BY donated_at DESC')->fetchAll();
        return array_map('map_donation_row', $rows);
    }

    public static function getSignupCountsByWorkId(): array
    {
        $rows = Database::connection()->query(
            'SELECT work_id, COUNT(*) AS cnt FROM volunteer_signups GROUP BY work_id',
        )->fetchAll();
        $counts = [];
        foreach ($rows as $row) {
            $counts[$row['work_id']] = (int) $row['cnt'];
        }
        return $counts;
    }

    public static function getAllVolunteerWorks(): array
    {
        $counts = self::getSignupCountsByWorkId();
        $rows = Database::connection()->query('SELECT * FROM volunteer_works')->fetchAll();
        $works = array_map(function ($row) use ($counts) {
            $work = map_volunteer_work_row($row);
            return self::autoUpdateWorkStatus($work, $counts[$work['id']] ?? 0);
        }, $rows);

        $order = ['open' => 0, 'ongoing' => 1, 'closed' => 2, 'completed' => 3, 'cancelled' => 4];
        usort($works, function ($a, $b) use ($order) {
            $oa = $order[$a['status']] ?? 5;
            $ob = $order[$b['status']] ?? 5;
            if ($oa !== $ob) {
                return $oa <=> $ob;
            }
            return strtotime($a['scheduledFor']) <=> strtotime($b['scheduledFor']);
        });
        return $works;
    }

    public static function getVolunteerWork(string $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM volunteer_works WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $counts = self::getSignupCountsByWorkId();
        $work = map_volunteer_work_row($row);
        return self::autoUpdateWorkStatus($work, $counts[$id] ?? 0);
    }

    private static function autoUpdateWorkStatus(array $work, int $signupCount): array
    {
        $now = time();
        $endTime = $work['endDate'] ? strtotime($work['endDate']) : strtotime($work['scheduledFor']);
        if ($endTime < $now && !in_array($work['status'], ['completed', 'cancelled'], true)) {
            Database::connection()->prepare('UPDATE volunteer_works SET status = ? WHERE id = ?')
                ->execute(['completed', $work['id']]);
            $work['status'] = 'completed';
        }
        if (
            $work['maxVolunteers'] !== null
            && $signupCount >= $work['maxVolunteers']
            && $work['status'] === 'open'
        ) {
            Database::connection()->prepare('UPDATE volunteer_works SET status = ? WHERE id = ?')
                ->execute(['closed', $work['id']]);
            $work['status'] = 'closed';
        }
        return $work;
    }

    public static function createVolunteerWork(array $data): array
    {
        $id = uuid_v4();
        $scheduled = date('Y-m-d H:i:s', strtotime((string) $data['scheduledFor']));
        $endDate = !empty($data['endDate']) ? date('Y-m-d H:i:s', strtotime((string) $data['endDate'])) : null;
        $stmt = Database::connection()->prepare(
            'INSERT INTO volunteer_works (id, title, description, location, scheduled_for, end_date, hours, status, category, max_volunteers)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        );
        $stmt->execute([
            $id,
            $data['title'],
            $data['description'],
            $data['location'],
            $scheduled,
            $endDate,
            (int) $data['hours'],
            $data['status'] ?? 'open',
            $data['category'] ?? 'other',
            $data['maxVolunteers'] ?? null,
        ]);
        return self::getVolunteerWork($id);
    }

    public static function updateVolunteerWork(string $id, array $updates): ?array
    {
        $existing = self::getVolunteerWork($id);
        if (!$existing) {
            return null;
        }
        $merged = array_merge($existing, $updates);
        if (isset($updates['scheduledFor'])) {
            $merged['scheduledFor'] = date('Y-m-d H:i:s', strtotime((string) $updates['scheduledFor']));
        }
        if (array_key_exists('endDate', $updates)) {
            $merged['endDate'] = !empty($updates['endDate'])
                ? date('Y-m-d H:i:s', strtotime((string) $updates['endDate']))
                : null;
        }
        $stmt = Database::connection()->prepare(
            'UPDATE volunteer_works SET title = ?, description = ?, location = ?, scheduled_for = ?, end_date = ?, hours = ?, status = ?, category = ?, max_volunteers = ? WHERE id = ?',
        );
        $stmt->execute([
            $merged['title'],
            $merged['description'],
            $merged['location'],
            date('Y-m-d H:i:s', strtotime((string) $merged['scheduledFor'])),
            $merged['endDate'] ? date('Y-m-d H:i:s', strtotime((string) $merged['endDate'])) : null,
            (int) $merged['hours'],
            $merged['status'],
            $merged['category'],
            $merged['maxVolunteers'],
            $id,
        ]);
        return self::getVolunteerWork($id);
    }

    public static function deleteVolunteerWork(string $id): bool
    {
        $stmt = Database::connection()->prepare('DELETE FROM volunteer_works WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public static function createVolunteerSignup(string $userId, string $workId): ?array
    {
        $existing = Database::connection()->prepare(
            'SELECT * FROM volunteer_signups WHERE user_id = ? AND work_id = ?',
        );
        $existing->execute([$userId, $workId]);
        $row = $existing->fetch();
        if ($row) {
            return map_signup_row($row);
        }

        $work = self::getVolunteerWork($workId);
        if (!$work) {
            return null;
        }
        $counts = self::getSignupCountsByWorkId();
        $current = $counts[$workId] ?? 0;
        if ($work['maxVolunteers'] !== null && $current >= $work['maxVolunteers']) {
            return null;
        }

        $id = uuid_v4();
        Database::connection()->prepare(
            'INSERT INTO volunteer_signups (id, user_id, work_id) VALUES (?, ?, ?)',
        )->execute([$id, $userId, $workId]);

        $newCount = $current + 1;
        if ($work['maxVolunteers'] !== null && $newCount >= $work['maxVolunteers'] && $work['status'] === 'open') {
            Database::connection()->prepare('UPDATE volunteer_works SET status = ? WHERE id = ?')
                ->execute(['closed', $workId]);
        }

        $stmt = Database::connection()->prepare('SELECT * FROM volunteer_signups WHERE id = ?');
        $stmt->execute([$id]);
        return map_signup_row($stmt->fetch());
    }

    public static function deleteVolunteerSignup(string $userId, string $workId): bool
    {
        $stmt = Database::connection()->prepare(
            'DELETE FROM volunteer_signups WHERE user_id = ? AND work_id = ?',
        );
        $stmt->execute([$userId, $workId]);
        if ($stmt->rowCount() === 0) {
            return false;
        }
        $work = self::getVolunteerWork($workId);
        if ($work && $work['status'] === 'closed' && $work['maxVolunteers'] !== null) {
            $counts = self::getSignupCountsByWorkId();
            if (($counts[$workId] ?? 0) < $work['maxVolunteers']) {
                Database::connection()->prepare('UPDATE volunteer_works SET status = ? WHERE id = ?')
                    ->execute(['open', $workId]);
            }
        }
        return true;
    }

    public static function getSignupsByUserId(string $userId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM volunteer_signups WHERE user_id = ? ORDER BY signed_up_at DESC',
        );
        $stmt->execute([$userId]);
        return array_map('map_signup_row', $stmt->fetchAll());
    }

    public static function getExpenseBreakdown(): array
    {
        $pdo = Database::connection();
        $adoptionTotal = (int) $pdo->query(
            'SELECT COALESCE(SUM(amount * price), 0) FROM adoptions',
        )->fetchColumn();
        $donationTotal = (int) $pdo->query(
            'SELECT COALESCE(SUM(amount), 0) FROM donations',
        )->fetchColumn();
        $totalRaised = $adoptionTotal + $donationTotal;
        $categories = [];
        foreach (self::EXPENSE_CATEGORIES as $c) {
            $categories[] = [
                ...$c,
                'amount' => (int) round(($totalRaised * $c['percent']) / 100),
            ];
        }
        return ['totalRaised' => $totalRaised, 'categories' => $categories];
    }
}
