# Migration for adding chapter field to AudiobookProgress

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('audiobooks', '0002_audiochapter'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='audiobookprogress',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='audiobookprogress',
            name='chapter',
            field=models.ForeignKey(blank=True, help_text='Specific chapter being played (optional)', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_progress', to='audiobooks.audiochapter'),
        ),
        migrations.AlterUniqueTogether(
            name='audiobookprogress',
            unique_together={('user', 'audiobook', 'chapter')},
        ),
    ]
