<?php

declare(strict_types=1);

function dispatch_routes(string $method, string $path): void
{
  // ----------------- Auth -----------------
  if ($method === 'POST' && $path === '/auth/signup') {
    $body = Auth::validateCredentials(read_json_body());
    if (Storage::getUserByUsername($body['username'])) {
      json_error('Username is already taken', 409);
    }
    $users = Storage::getAllUsers();
    $user = Storage::createUser([
      'username' => $body['username'],
      'password' => Auth::hashPassword($body['password']),
      'isAdmin' => count($users) === 0,
      'firstName' => $body['firstName'],
      'lastName' => $body['lastName'],
      'email' => $body['email'],
    ]);
    Auth::setUserId($user['id']);
    json_response(['id' => $user['id'], 'username' => $user['username'], 'isAdmin' => $user['isAdmin']], 201);
  }

  if ($method === 'POST' && $path === '/auth/login') {
    $body = Auth::validateCredentials(read_json_body());
    $user = Storage::getUserByUsername($body['username']);
    if (!$user || !Auth::verifyPassword($body['password'], $user['password'])) {
      json_error('Invalid username or password', 401);
    }
    Auth::setUserId($user['id']);
    json_response(['id' => $user['id'], 'username' => $user['username'], 'isAdmin' => $user['isAdmin']]);
  }

  if ($method === 'POST' && $path === '/auth/logout') {
    Auth::clear();
    json_response(['ok' => true]);
  }

  if ($method === 'GET' && $path === '/auth/me') {
    $userId = Auth::userId();
    if (!$userId) {
      json_error('Not authenticated', 401);
    }
    $user = Storage::getUser($userId);
    if (!$user) {
      json_error('Not authenticated', 401);
    }
    json_response(['id' => $user['id'], 'username' => $user['username'], 'isAdmin' => $user['isAdmin']]);
  }

  // ----------------- Public corals -----------------
  if ($method === 'GET' && $path === '/corals') {
    json_response(Storage::getAllCorals());
  }

  // ----------------- Adoptions -----------------
  if ($method === 'GET' && $path === '/adoptions') {
    $userId = Auth::requireAuth();
    json_response(Storage::getAdoptionsByUserId($userId));
  }

  if ($method === 'POST' && $path === '/adoptions') {
    $userId = Auth::requireAuth();
    $body = read_json_body();
    $coralId = trim((string) ($body['coralId'] ?? ''));
    $amount = (int) ($body['amount'] ?? 0);
    if ($coralId === '') {
      json_error('Pick a coral');
    }
    if ($amount <= 0) {
      json_error('Amount must be positive');
    }
    $result = Storage::createAdoption($userId, $coralId, $amount);
    if (!$result['ok']) {
      if ($result['reason'] === 'not_found') {
        json_error('Coral not found', 404);
      }
      json_error('Not enough stock available for that amount');
    }
    json_response($result['adoption'], 201);
  }

  if ($method === 'DELETE' && preg_match('#^/adoptions/([^/]+)$#', $path, $m)) {
    $userId = Auth::requireAuth();
    if (!Storage::deleteAdoption($userId, $m[1])) {
      json_error('Adoption not found', 404);
    }
    json_response(['ok' => true]);
  }

  // ----------------- Donations -----------------
  if ($method === 'GET' && $path === '/donations') {
    $userId = Auth::requireAuth();
    json_response(Storage::getDonationsByUserId($userId));
  }

  if ($method === 'POST' && $path === '/donations') {
    $userId = Auth::requireAuth();
    $body = read_json_body();
    $amount = (int) ($body['amount'] ?? 0);
    if ($amount < 1) {
      json_error('Minimum donation is $1');
    }
    if ($amount > 100000) {
      json_error('Maximum donation is $100,000');
    }
    $donation = Storage::createDonation($userId, [
      'amount' => $amount,
      'donorName' => trim((string) ($body['donorName'] ?? '')) ?: null,
      'donorEmail' => trim((string) ($body['donorEmail'] ?? '')) ?: null,
    ]);
    json_response($donation, 201);
  }

  // ----------------- Volunteer -----------------
  if ($method === 'GET' && $path === '/volunteer-works') {
    $works = Storage::getAllVolunteerWorks();
    $counts = Storage::getSignupCountsByWorkId();
    json_response(array_map(function ($w) use ($counts) {
      return [...$w, 'volunteerCount' => $counts[$w['id']] ?? 0];
    }, $works));
  }

  if ($method === 'POST' && preg_match('#^/volunteer-works/([^/]+)/signup$#', $path, $m)) {
    $userId = Auth::requireAuth();
    $work = Storage::getVolunteerWork($m[1]);
    if (!$work) {
      json_error('Work not found', 404);
    }
    if ($work['status'] !== 'open') {
      json_error('This opportunity is no longer open for sign-ups');
    }
    $signup = Storage::createVolunteerSignup($userId, $work['id']);
    if (!$signup) {
      json_error('This opportunity is full');
    }
    json_response($signup, 201);
  }

  if ($method === 'DELETE' && preg_match('#^/volunteer-works/([^/]+)/signup$#', $path, $m)) {
    $userId = Auth::requireAuth();
    if (!Storage::deleteVolunteerSignup($userId, $m[1])) {
      json_error('Signup not found', 404);
    }
    json_response(['ok' => true]);
  }

  if ($method === 'GET' && $path === '/volunteer-signups') {
    $userId = Auth::requireAuth();
    $signups = Storage::getSignupsByUserId($userId);
    $works = Storage::getAllVolunteerWorks();
    $workById = [];
    foreach ($works as $w) {
      $workById[$w['id']] = $w;
    }
    $result = [];
    foreach ($signups as $s) {
      $work = $workById[$s['workId']] ?? null;
      if ($work) {
        $result[] = [...$s, 'work' => $work];
      }
    }
    json_response($result);
  }

  if ($method === 'GET' && $path === '/expense-breakdown') {
    json_response(Storage::getExpenseBreakdown());
  }

  // ----------------- Admin corals -----------------
  if ($method === 'POST' && $path === '/admin/corals') {
    Auth::requireAdmin();
    $body = read_json_body();
    $name = trim((string) ($body['name'] ?? ''));
    $image = trim((string) ($body['image'] ?? ''));
    if ($name === '' || $image === '') {
      json_error('Name and image are required');
    }
    $coral = Storage::createCoral([
      'name' => $name,
      'image' => $image,
      'description' => trim((string) ($body['description'] ?? '')),
      'price' => (int) ($body['price'] ?? 0),
      'stock' => (int) ($body['stock'] ?? 0),
    ]);
    json_response($coral, 201);
  }

  if ($method === 'PATCH' && preg_match('#^/admin/corals/([^/]+)$#', $path, $m)) {
    Auth::requireAdmin();
    $updated = Storage::updateCoral($m[1], read_json_body());
    if (!$updated) {
      json_error('Coral not found', 404);
    }
    json_response($updated);
  }

  if ($method === 'DELETE' && preg_match('#^/admin/corals/([^/]+)$#', $path, $m)) {
    Auth::requireAdmin();
    if (!Storage::deleteCoral($m[1])) {
      json_error('Coral not found', 404);
    }
    json_response(['ok' => true]);
  }

  // ----------------- Admin volunteer works -----------------
  if ($method === 'POST' && $path === '/admin/volunteer-works') {
    Auth::requireAdmin();
    $body = read_json_body();
    $title = trim((string) ($body['title'] ?? ''));
    if ($title === '') {
      json_error('Title is required');
    }
    $work = Storage::createVolunteerWork($body);
    json_response($work, 201);
  }

  if ($method === 'PATCH' && preg_match('#^/admin/volunteer-works/([^/]+)$#', $path, $m)) {
    Auth::requireAdmin();
    $updated = Storage::updateVolunteerWork($m[1], read_json_body());
    if (!$updated) {
      json_error('Volunteer work not found', 404);
    }
    json_response($updated);
  }

  if ($method === 'DELETE' && preg_match('#^/admin/volunteer-works/([^/]+)$#', $path, $m)) {
    Auth::requireAdmin();
    if (!Storage::deleteVolunteerWork($m[1])) {
      json_error('Volunteer work not found', 404);
    }
    json_response(['ok' => true]);
  }

  // ----------------- Admin views -----------------
  if ($method === 'GET' && $path === '/admin/adoptions') {
    Auth::requireAdmin();
    $adoptions = Storage::getAllAdoptions();
    $users = Storage::getAllUsers();
    $userById = [];
    foreach ($users as $u) {
      $userById[$u['id']] = $u;
    }
    json_response(array_map(function ($a) use ($userById) {
      return [...$a, 'username' => $userById[$a['userId']]['username'] ?? 'Unknown'];
    }, $adoptions));
  }

  if ($method === 'GET' && $path === '/admin/donations') {
    Auth::requireAdmin();
    $donations = Storage::getAllDonations();
    $users = Storage::getAllUsers();
    $userById = [];
    foreach ($users as $u) {
      $userById[$u['id']] = $u;
    }
    json_response(array_map(function ($d) use ($userById) {
      return [...$d, 'username' => $userById[$d['userId']]['username'] ?? 'Unknown'];
    }, $donations));
  }

  if ($method === 'GET' && $path === '/admin/users') {
    Auth::requireAdmin();
    $users = Storage::getAllUsers();
    $adoptions = Storage::getAllAdoptions();
    $donations = Storage::getAllDonations();
    json_response(array_map(function ($u) use ($adoptions, $donations) {
      $userAdoptions = array_filter($adoptions, fn ($a) => $a['userId'] === $u['id']);
      $userDonations = array_filter($donations, fn ($d) => $d['userId'] === $u['id']);
      $donationTotal = array_reduce($userDonations, fn ($s, $d) => $s + $d['amount'], 0);
      $signups = Storage::getSignupsByUserId($u['id']);
      return [
        'id' => $u['id'],
        'username' => $u['username'],
        'isAdmin' => $u['isAdmin'],
        'adoptionCount' => count($userAdoptions),
        'donationTotal' => $donationTotal,
        'volunteerShifts' => count($signups),
      ];
    }, $users));
  }

  if ($method === 'GET' && $path === '/admin/volunteer-signups') {
    Auth::requireAdmin();
    $works = Storage::getAllVolunteerWorks();
    $users = Storage::getAllUsers();
    $workById = [];
    foreach ($works as $w) {
      $workById[$w['id']] = $w;
    }
    $userById = [];
    foreach ($users as $u) {
      $userById[$u['id']] = $u;
    }
    $allSignups = [];
    foreach ($users as $u) {
      foreach (Storage::getSignupsByUserId($u['id']) as $s) {
        $allSignups[] = [
          ...$s,
          'username' => $userById[$s['userId']]['username'] ?? 'Unknown',
          'workTitle' => $workById[$s['workId']]['title'] ?? 'Unknown',
        ];
      }
    }
    json_response($allSignups);
  }

  json_error('Not found', 404);
}
