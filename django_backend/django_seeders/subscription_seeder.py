from wallet.models import SubscriptionPricing


def seed_subscription_pricing():
    """Seed subscription pricing plans"""
    subscription_plans = [
        {
            'plan': 'MONTHLY',
            'price': 2500,
            'duration_days': 30,
            'currency': 'XOF',
            'is_active': True,
            'description': 'Accès mensuel à tous les audiobooks premium et avantages membres.',
            'features': [
                'Accès illimité aux audiobooks',
                'Écoute hors ligne',
                'Qualité audio haute',
                'Suppression des publicités',
            ]
        },
        {
            'plan': 'QUARTERLY',
            'price': 6000,
            'duration_days': 90,
            'currency': 'XOF',
            'is_active': True,
            'description': 'Accès trimestriel avec économies de 20%.',
            'features': [
                'Accès illimité aux audiobooks',
                'Écoute hors ligne',
                'Qualité audio haute',
                'Suppression des publicités',
                'Support prioritaire',
                'Nouvelles sorties en avant-première',
            ],
            'discount_percent': 20.00,
        },
        {
            'plan': 'YEARLY',
            'price': 20000,
            'duration_days': 365,
            'currency': 'XOF',
            'is_active': True,
            'description': 'Accès annuel avec économies de 33%.',
            'features': [
                'Accès illimité aux audiobooks',
                'Écoute hors ligne',
                'Qualité audio haute',
                'Suppression des publicités',
                'Support prioritaire',
                'Nouvelles sorties en avant-première',
                'Accès aux contenu exclusif',
                'Crédits de livre gratuits',
            ],
            'discount_percent': 33.33,
        },
    ]

    for plan_data in subscription_plans:
        SubscriptionPricing.objects.update_or_create(
            plan=plan_data['plan'],
            defaults={
                'price': plan_data['price'],
                'duration_days': plan_data['duration_days'],
                'currency': plan_data['currency'],
                'is_active': plan_data['is_active'],
                'description': plan_data.get('description', ''),
                'features': plan_data.get('features', []),
                'discount_percent': plan_data.get('discount_percent', 0.00),
            }
        )

    print(f"✓ Seeded {len(subscription_plans)} subscription plans")
