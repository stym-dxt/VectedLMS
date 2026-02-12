"""add live_class_attendees for calendar invite visibility in LMS

Revision ID: 20260129_01
Revises: 20260212_02
Create Date: 2026-01-29

"""
from alembic import op
import sqlalchemy as sa

revision = "20260129_01"
down_revision = "20260212_02"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "live_class_attendees",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("live_class_id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["live_class_id"], ["live_classes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_live_class_attendees_id", "live_class_attendees", ["id"], unique=False)
    op.create_index("ix_live_class_attendees_email", "live_class_attendees", ["email"], unique=False)
    op.create_index("ix_live_class_attendees_live_class_id", "live_class_attendees", ["live_class_id"], unique=False)


def downgrade():
    op.drop_index("ix_live_class_attendees_live_class_id", table_name="live_class_attendees")
    op.drop_index("ix_live_class_attendees_email", table_name="live_class_attendees")
    op.drop_index("ix_live_class_attendees_id", table_name="live_class_attendees")
    op.drop_table("live_class_attendees")
