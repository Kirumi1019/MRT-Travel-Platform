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

1. Enter `yarn` in terminal
2. Enter `yarn dev` to start the project

- To view the database, enter 'yarn studio', click on the url in the terminal, and do NOT update.
Click on Open Drizzle Studio with pre drizzle-kit@0.21.1 support

- Note: It is recommended "not" to upgrade drizzle-kit to v0.21.
- Note: drizzle-kit should be kept in version 0.20.18.
- Note: v5.drizzle.studio

### Autotest
1. Rnter `yarn playwright test --ui` in terminal
2. In the interface of playwright, you can choose which testcase to run.
3. Choose testcase want to run. play it and the test will begin and provide steps checking result of the test.
- Reminder: Running `yarn playwright test` or run all the testcases at once is not recommended due to the limit of the system's performace which may failing in passing any of the testcases.

# Resource:
UI Design:
MUI, shadcn, lucide, radix
