#!/bin/sh

# Run the populate and seed scripts before starting the application
pnpm run populate:admin
pnpm run seed

exec "$@"
