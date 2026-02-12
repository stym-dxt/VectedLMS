"""phone required email optional, password_reset_tokens table

Revision ID: 20260212_01
Revises:
Create Date: 2026-02-12

"""
from alembic import op
import sqlalchemy as sa

revision = "20260212_01"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column(
        "users",
        "email",
        existing_type=sa.String(),
        nullable=True,
    )
    op.create_table(
        "password_reset_tokens",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(), nullable=False, index=True),
        sa.Column("token_hash", sa.String(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

def downgrade():
    op.drop_table("password_reset_tokens")
    op.alter_column(
        "users",
        "email",
        existing_type=sa.String(),
        nullable=False,
    )
