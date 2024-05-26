*Press ctrl+shift+V to preview in VSCode

# Deployment URL
https://mrt-travel-platform.vercel.app/

# Setup Guide

## Environment Setup
### 1. install nodejs
npm need to be install with 9.6.7
other version will not guarantee to work

### 2. install yarn
yarn need to be install with version 1.22.19

## Start
After environment setup, make a duplication of `.env.example` and renamed it `.env.local`

After downloading the codes

1. enter `yarn` in terminal
2. enter `yarn migrate` to connect to DB and migrate the table
3. enter `yarn dev` to start the project

- To view the database, enter 'yarn studio', click on the url in the terminal, and do NOT update.
Click on Open Drizzle Studio with pre drizzle-kit@0.21.1 support

- Note: It is recommended "not" to upgrade drizzle-kit to v0.21.
- Note: drizzle-kit should be kept in version 0.20.18.
- Note: v5.drizzle.studio

### Autotest
1. enter `yarn playwright test` in terminal
2. autotest's testcase will be started and return a test result after the test has been completed
3. You may also try `yarn playwright test --ui` to test in playwright's UI to selected testcase need to be ran and view the record of testing

# Resource:
UI Design:
MUI, shadcn, lucide, radix
