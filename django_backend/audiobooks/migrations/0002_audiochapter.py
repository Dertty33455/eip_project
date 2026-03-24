# Generated migration for AudioChapter model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('audiobooks', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AudioChapter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('chapter_number', models.IntegerField()),
                ('duration_minutes', models.IntegerField(help_text='Duration in minutes')),
                ('audio_url', models.URLField(max_length=500)),
                ('is_free', models.BooleanField(default=False, help_text='Make this chapter free for all users')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('audiobook', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chapters', to='audiobooks.audiobook')),
            ],
            options={
                'ordering': ['chapter_number'],
                'unique_together': {('audiobook', 'chapter_number')},
            },
        ),
    ]
