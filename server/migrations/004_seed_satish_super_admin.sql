select create_user(
  jsonb_build_object(
    'name', 'Satish Pathak',
    'email', 'satish.pathak52@gmail.com',
    'phone', '9637515289',
    'username', 'satish',
    'job_title', 'Sole Owner',
    'branch', 'Nalasopara East',
    'password_hash', '$2b$12$yE0z/KTMXl8pwuIXYoYBQeKM0kzUSJItCw8xIamQ5lpnCK0ns0682',
    'role', 'super_admin',
    'permissions', '{"all": "manage"}'::jsonb,
    'mfa_enabled', false,
    'mfa_method', 'none',
    'otp_channel', 'email',
    'is_active', true
  )
)
where not exists (
  select 1 from users where lower(email) = lower('satish.pathak52@gmail.com')
);
