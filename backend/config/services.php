<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URL'),
    ],

    'mtn_momo' => [
        'api_key' => env('MTN_MOMO_API_KEY'),
        'user_id' => env('MTN_MOMO_USER_ID'),
        'subscription_key' => env('MTN_MOMO_SUBSCRIPTION_KEY'),
        'base_url' => env('MTN_MOMO_API_URL'),
        'callback' => env('MTN_MOMO_CALLBACK_URL'),
    ],

    'moov_money' => [
        'api_key' => env('MOOV_MONEY_API_KEY'),
        'merchant_id' => env('MOOV_MONEY_MERCHANT_ID'),
        'base_url' => env('MOOV_MONEY_API_URL'),
        'callback' => env('MOOV_MONEY_CALLBACK_URL'),
    ],
];
