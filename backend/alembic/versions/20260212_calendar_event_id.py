"""add calendar_event_id to live_classes for Google Calendar sync

Revision ID: 20260212_02
Revises: 20260212_01
Create Date: 2026-02-12

"""
from alembic import op
import sqlalchemy as sa

revision = "20260212_02"
down_revision = "20260212_01"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "live_classes",
        sa.Column("calendar_event_id", sa.String(), nullable=True),
    )
    op.create_index("ix_live_classes_calendar_event_id", "live_classes", ["calendar_event_id"], unique=True)


def downgrade():
    op.drop_index("ix_live_classes_calendar_event_id", table_name="live_classes")
    op.drop_column("live_classes", "calendar_event_id")
