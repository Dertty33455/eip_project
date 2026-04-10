from core_settings.models import Setting


def seed_settings():
    """Seed core settings"""
    settings_data = [
        {
            'key': 'commission_rate',
            'value': '0.05',
            'type': 'number',
        },
        {
            'key': 'free_chapters',
            'value': '1',
            'type': 'number',
        },
        {
            'key': 'platform_name',
            'value': 'BookShell',
            'type': 'string',
        },
        {
            'key': 'currency',
            'value': 'XOF',
            'type': 'string',
        },
        {
            'key': 'min_withdrawal',
            'value': '1000',
            'type': 'number',
        },
        {
            'key': 'max_withdrawal',
            'value': '500000',
            'type': 'number',
        },
    ]

    for setting_data in settings_data:
        Setting.objects.update_or_create(
            key=setting_data['key'],
            defaults={
                'value': setting_data['value'],
                'type': setting_data['type'],
            }
        )

    print(f"✓ Seeded {len(settings_data)} settings")
