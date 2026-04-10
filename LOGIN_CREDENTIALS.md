# LoginCredentials

## Seeded Demo Accounts

After running `python manage.py seed`, you can login with these credentials:

### Admin Account
- **Email**: `admin@test.com`  
- **Username**: `admin`
- **Password**: `Test123!`
- **Role**: Admin

### Seller Accounts
1. **Ahmad Diop**
   - Email: `ahmad.d@example.com`
   - Username: `seller1`
   - Password: `Seller123!`

2. **Fatou Ba**
   - Email: `fatou.b@example.com`
   - Username: `seller2`
   - Password: `Seller123!`

3. **Kofi Mensah**
   - Email: `kofi@example.com`
   - Username: `kofi_mensah`
   - Password: `Seller123!`
   - Verified: ✓

4. **Chidi Okonkwo**
   - Email: `chidi@example.com`
   - Username: `chidi_books`
   - Password: `Seller123!`
   - Verified: ✓

### Regular User Accounts
1. **Moussa Fall**
   - Email: `moussa.f@example.com`
   - Username: `user1`
   - Password: `User123!`

2. **Aminata Sow**
   - Email: `aminata.s@example.com`
   - Username: `user2`
   - Password: `User123!`

3. **Ibrahim Ndiaye**
   - Email: `ibrahim.n@example.com`
   - Username: `user3`
   - Password: `User123!`

4. **Aminata Diallo**
   - Email: `aminata@example.com`
   - Username: `aminata_d`
   - Password: `User123!`

## Using Email for Login

The frontend expects **email** for login (not username). So when you see a login form, use the email address listed above.

### Example Frontend Login
```
Email: admin@test.com
Password: Test123!
```

## Testing the API

To test the login endpoint directly:

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123!"}'
```

Response:
```json
{
  "user": {
    "id": "...",
    "email": "admin@test.com",
    "username": "admin",
    "firstName": "...",
    "lastName": "...",
    "role": "ADMIN"
  },
  "token": "eyJ0eXAiOiJKV1QiLC..."
}
```

## Updating Passwords

If you need to change a user's password:

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(username='admin')
user.set_password('NewPassword123!')
user.save()
```

## API Base URL

The Django backend should be running at: `http://localhost:8000`

Make sure to have the correct `NEXT_PUBLIC_API_URL` environment variable set in your `.env.local` file in the frontend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
