Last login: Sat Jan 10 23:56:29 on ttys010
/dev/fd/12:18: command not found: compdef
(base) ammarabduholiqov@ammar-2 ~ % ssh root@193.149.18.77
The authenticity of host '193.149.18.77 (193.149.18.77)' can't be established.
ED25519 key fingerprint is SHA256:xRDMSMU8lMFRbgvak+wIBDgq62CrKZQLOO94AfZ6t+M.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '193.149.18.77' (ED25519) to the list of known hosts.
root@193.149.18.77's password: 

(base) ammarabduholiqov@ammar-2 ~ % ssh root@193.149.18.77
root@193.149.18.77's password: 
Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-88-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

Expanded Security Maintenance for Applications is not enabled.

24 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


*** System restart required ***
Last login: Mon Dec 15 10:14:49 2025 from 217.30.163.29
root@shannon:~# Read from remote host 193.149.18.77: Operation timed out
Connection to 193.149.18.77 closed.
client_loop: send disconnect: Broken pipe
(base) ammarabduholiqov@ammar-2 ~ % ssh root@193.149.18.77
root@193.149.18.77's password: 
Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-88-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

Expanded Security Maintenance for Applications is not enabled.

24 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


*** System restart required ***
Last login: Mon Jan 12 06:43:02 2026 from 37.110.215.30
root@shannon:~# curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
2026-01-12 06:50:21 - Installing pre-requisites
Hit:1 http://mirror.servercore.com/ubuntu noble InRelease
Get:2 http://mirror.servercore.com/ubuntu noble-updates InRelease [126 kB]     
Hit:3 https://mirror.servercore.com/3rd-party/cloud-init-deb/noble noble InRelease
Get:4 http://mirror.servercore.com/ubuntu noble-backports InRelease [126 kB]
Get:5 http://mirror.servercore.com/ubuntu noble-updates/main amd64 Packages [1690 kB]
Hit:6 http://security.ubuntu.com/ubuntu noble-security InRelease               
Get:7 http://mirror.servercore.com/ubuntu noble-updates/universe amd64 Packages [1510 kB]
Hit:8 https://packages.microsoft.com/ubuntu/22.04/prod jammy InRelease         
Fetched 3453 kB in 1s (2331 kB/s)                                              
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
24 packages can be upgraded. Run 'apt list --upgradable' to see them.
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
apt-transport-https is already the newest version (2.8.3).
ca-certificates is already the newest version (20240203).
curl is already the newest version (8.5.0-2ubuntu10.6).
gnupg is already the newest version (2.4.4-2ubuntu17.4).
0 upgraded, 0 newly installed, 0 to remove and 24 not upgraded.
Hit:1 http://mirror.servercore.com/ubuntu noble InRelease
Hit:2 http://mirror.servercore.com/ubuntu noble-updates InRelease              
Hit:3 http://mirror.servercore.com/ubuntu noble-backports InRelease            
Hit:4 https://mirror.servercore.com/3rd-party/cloud-init-deb/noble noble InRelease
Hit:5 http://security.ubuntu.com/ubuntu noble-security InRelease               
Hit:6 https://packages.microsoft.com/ubuntu/22.04/prod jammy InRelease         
Get:7 https://deb.nodesource.com/node_20.x nodistro InRelease [12.1 kB]    
Get:8 https://deb.nodesource.com/node_20.x nodistro/main amd64 Packages [13.2 kB]
Fetched 25.3 kB in 1s (23.6 kB/s)  
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
24 packages can be upgraded. Run 'apt list --upgradable' to see them.
2026-01-12 06:50:28 - Repository configured successfully.
2026-01-12 06:50:28 - To install Node.js, run: apt install nodejs -y
2026-01-12 06:50:28 - You can use N|solid Runtime as a node.js alternative
2026-01-12 06:50:28 - To install N|solid Runtime, run: apt install nsolid -y 

Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
nginx is already the newest version (1.24.0-2ubuntu7.5).
The following additional packages will be installed:
  git-man liberror-perl
Suggested packages:
  git-daemon-run | git-daemon-sysvinit git-doc git-email git-gui gitk gitweb
  git-cvs git-mediawiki git-svn
The following NEW packages will be installed:
  git git-man liberror-perl nodejs
0 upgraded, 4 newly installed, 0 to remove and 24 not upgraded.
Need to get 36.8 MB of archives.
After this operation, 221 MB of additional disk space will be used.
Get:1 http://mirror.servercore.com/ubuntu noble/main amd64 liberror-perl all 0.17029-2 [25.6 kB]
Get:2 http://mirror.servercore.com/ubuntu noble-updates/main amd64 git-man all 1:2.43.0-1ubuntu7.3 [1100 kB]
Get:3 http://mirror.servercore.com/ubuntu noble-updates/main amd64 git amd64 1:2.43.0-1ubuntu7.3 [3680 kB]
Get:4 https://deb.nodesource.com/node_20.x nodistro/main amd64 nodejs amd64 20.19.6-1nodesource1 [32.0 MB]
Fetched 36.8 MB in 2s (18.9 MB/s)                                            
Selecting previously unselected package liberror-perl.
(Reading database ... 35175 files and directories currently installed.)
Preparing to unpack .../liberror-perl_0.17029-2_all.deb ...
Unpacking liberror-perl (0.17029-2) ...
Selecting previously unselected package git-man.
Preparing to unpack .../git-man_1%3a2.43.0-1ubuntu7.3_all.deb ...
Unpacking git-man (1:2.43.0-1ubuntu7.3) ...
Selecting previously unselected package git.
Preparing to unpack .../git_1%3a2.43.0-1ubuntu7.3_amd64.deb ...
Unpacking git (1:2.43.0-1ubuntu7.3) ...
Selecting previously unselected package nodejs.
Preparing to unpack .../nodejs_20.19.6-1nodesource1_amd64.deb ...
Unpacking nodejs (20.19.6-1nodesource1) ...
Setting up nodejs (20.19.6-1nodesource1) ...
Setting up liberror-perl (0.17029-2) ...
Setting up git-man (1:2.43.0-1ubuntu7.3) ...
Setting up git (1:2.43.0-1ubuntu7.3) ...
Processing triggers for man-db (2.12.0-4build2) ...
root@shannon:~# Read from remote host 193.149.18.77: Operation timed out
Connection to 193.149.18.77 closed.
client_loop: send disconnect: Broken pipe
(base) ammarabduholiqov@ammar-2 ~ % ssh root@193.149.18.77
root@193.149.18.77's password: 
Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-88-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

Expanded Security Maintenance for Applications is not enabled.

24 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


*** System restart required ***
Last login: Mon Jan 12 06:50:12 2026 from 37.110.215.30
root@shannon:~# cd /var/www

# Ana Proje (mymd.uz)
git clone https://github.com/Haliqov01/mymd-uz.git mymd-main

# Doktor Projesi (doctor.mymd.uz)
git clone https://github.com/Haliqov01/doctor-mymd.uz-frontend.git doctor-portal
Cloning into 'mymd-main'...
Username for 'https://github.com': Haliqov01
Password for 'https://Haliqov01@github.com': 
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/Haliqov01/mymd-uz.git/'
Cloning into 'doctor-portal'...
remote: Enumerating objects: 419, done.
remote: Counting objects: 100% (419/419), done.
remote: Compressing objects: 100% (221/221), done.
remote: Total 419 (delta 173), reused 401 (delta 155), pack-reused 0 (from 0)
Receiving objects: 100% (419/419), 300.50 KiB | 1002.00 KiB/s, done.
Resolving deltas: 100% (173/173), done.
root@shannon:/var/www# pm2 start npm --name "doctor-portal" -- start -- -p 3001
Command 'pm2' not found, did you mean:
  command 'pom2' from deb libpod-pom-perl (2.01-4)
  command 'pmg' from deb python3-pymatgen (2023.06.23+dfsg1-2build1)
  command 'tpm2' from deb tpm2-tools (5.4-1)
  command 'pms' from deb pms (0.42-1.1)
  command 'gm2' from deb gm2 (4:13.2.0-2ubuntu1)
  command 'pm' from deb powerman (2.3.27-4)
  command 'pmw' from deb pmw (1:5.22-1)
  command 'wm2' from deb wm2 (4+svn20090216-4build1)
  command 'pmc' from deb linuxptp (4.0-1ubuntu1.1)
Try: apt install <deb name>
root@shannon:/var/www# npm install -g pm2

added 133 packages in 20s

13 packages are looking for funding
  run `npm fund` for details
npm notice
npm notice New major version of npm available! 10.8.2 -> 11.7.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.7.0
npm notice To update run: npm install -g npm@11.7.0
npm notice
root@shannon:/var/www# cd /var/www/doctor-portal
npm install
npm run build
# Port 3001 üzerinden başlatıyoruz
pm2 start npm --name "doctor-portal" -- start -- -p 3001

added 466 packages, and audited 467 packages in 27s

155 packages are looking for funding
  run `npm fund` for details

2 vulnerabilities (1 moderate, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.

> doctor-mymd@0.1.0 build
> next build

[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

   ▲ Next.js 16.0.1 (Turbopack)
   - Experiments (use with caution):
     · optimizePackageImports

 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
   Creating an optimized production build ...
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
 ✓ Compiled successfully in 19.1s
 ✓ Finished TypeScript in 14.7s    
   Collecting page data  .[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
 ✓ Collecting page data in 689.3ms    
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
 ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/[locale]/dashboard/reports/create". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    at S (/var/www/doctor-portal/.next/server/chunks/ssr/node_modules_50f8e02d._.js:2:2111)
    at p (/var/www/doctor-portal/.next/server/chunks/ssr/node_modules_50f8e02d._.js:4:4847)
    at ap (/var/www/doctor-portal/.next/server/chunks/ssr/_44ac0152._.js:1:36599)
    at ir (/var/www/doctor-portal/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:84433)
    at ia (/var/www/doctor-portal/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:86252)
    at il (/var/www/doctor-portal/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:107981)
    at is (/var/www/doctor-portal/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:105399)
    at ii (/var/www/doctor-portal/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:84785)
    at ia (/var/www/doctor-portal/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:86301)
    at ia (/var/www/doctor-portal/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:2:104739)
Error occurred prerendering page "/uz/dashboard/reports/create". Read more: https://nextjs.org/docs/messages/prerender-error
Export encountered an error on /[locale]/dashboard/reports/create/page: /uz/dashboard/reports/create, exiting the build.
 ⨯ Next.js build worker exited with code: 1 and signal: null

                        -------------

__/\\\\\\\\\\\\\____/\\\\____________/\\\\____/\\\\\\\\\_____
 _\/\\\/////////\\\_\/\\\\\\________/\\\\\\__/\\\///////\\\___
  _\/\\\_______\/\\\_\/\\\//\\\____/\\\//\\\_\///______\//\\\__
   _\/\\\\\\\\\\\\\/__\/\\\\///\\\/\\\/_\/\\\___________/\\\/___
    _\/\\\/////////____\/\\\__\///\\\/___\/\\\________/\\\//_____
     _\/\\\_____________\/\\\____\///_____\/\\\_____/\\\//________
      _\/\\\_____________\/\\\_____________\/\\\___/\\\/___________
       _\/\\\_____________\/\\\_____________\/\\\__/\\\\\\\\\\\\\\\_
        _\///______________\///______________\///__\///////////////__


                          Runtime Edition

        PM2 is a Production Process Manager for Node.js applications
                     with a built-in Load Balancer.

                Start and Daemonize any application:
                $ pm2 start app.js

                Load Balance 4 instances of api.js:
                $ pm2 start api.js -i 4

                Monitor in production:
                $ pm2 monitor

                Make pm2 auto-boot at server restart:
                $ pm2 startup

                To go further checkout:
                http://pm2.io/


                        -------------

[PM2] Spawning PM2 daemon with pm2_home=/root/.pm2
[PM2] PM2 Successfully daemonized
[PM2] Starting /usr/bin/npm in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ doctor-portal      │ fork     │ 0    │ online    │ 0%       │ 29.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
root@shannon:/var/www/doctor-portal# Read from remote host 193.149.18.77: Operation timed out
Connection to 193.149.18.77 closed.
client_loop: send disconnect: Broken pipe
(base) ammarabduholiqov@ammar-2 ~ % ssh root@193.149.18.77
root@193.149.18.77's password: 
Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-88-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

Expanded Security Maintenance for Applications is not enabled.

24 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


*** System restart required ***
Last login: Mon Jan 12 07:06:29 2026 from 37.110.215.30
root@shannon:~# cd /var/www
git clone https://github.com/Haliqov01/mymd-uz.git mymd-main
Cloning into 'mymd-main'...
Username for 'https://github.com': Haliqov01
Password for 'https://Haliqov01@github.com': 
remote: Write access to repository not granted.
fatal: unable to access 'https://github.com/Haliqov01/mymd-uz.git/': The requested URL returned error: 403
root@shannon:/var/www# cd /var/www
# Eğer eski bir hatalı klasör oluştuysa önce silin:
rm -rf mymd-main 
git clone https://github.com/Haliqov01/mymd-uz.git mymd-main
Cloning into 'mymd-main'...
Username for 'https://github.com': Haliqov01
Password for 'https://Haliqov01@github.com': 
remote: Enumerating objects: 459, done.
remote: Counting objects: 100% (459/459), done.
remote: Compressing objects: 100% (225/225), done.
remote: Total 459 (delta 161), reused 446 (delta 151), pack-reused 0 (from 0)
Receiving objects: 100% (459/459), 365.58 KiB | 950.00 KiB/s, done.
Resolving deltas: 100% (161/161), done.
root@shannon:/var/www# cd /var/www/mymd-main
npm install
npm run build
# Port 3000 üzerinden başlatın
pm2 start npm --name "mymd-main" -- start

added 450 packages, and audited 451 packages in 50s

151 packages are looking for funding
  run `npm fund` for details

5 vulnerabilities (2 moderate, 3 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

> mymd.uz@0.1.0 build
> next build --turbopack

   ▲ Next.js 15.5.4 (Turbopack)
   - Experiments (use with caution):
     · serverActions
     · optimizePackageImports

   Creating an optimized production build ...
 ✓ Finished writing to disk in 129ms
 ✓ Compiled successfully in 59s

./app/[locale]/dashboard/admin/patients/new/page.tsx
91:8  Warning: React Hook useEffect has a missing dependency: 'fetchDoctors'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./app/[locale]/dashboard/patient/appointments/page.tsx
98:6  Warning: React Hook useEffect has a missing dependency: 'fetchAppointments'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./app/[locale]/dashboard/patient/doctors/[id]/page.tsx
59:6  Warning: React Hook useEffect has a missing dependency: 'fetchDoctor'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./app/[locale]/dashboard/patient/doctors/page.tsx
60:6  Warning: React Hook useEffect has a missing dependency: 'fetchDoctors'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./app/[locale]/dashboard/patient/page.tsx
44:6  Warning: React Hook useEffect has a missing dependency: 'fetchUserData'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./app/[locale]/dashboard/patient/profile/page.tsx
50:6  Warning: React Hook useEffect has a missing dependency: 'fetchProfileData'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./app/[locale]/dashboard/patient/settings/page.tsx
109:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./components/error-boundary.tsx
25:21  Warning: 'error' is defined but never used. Allowed unused args must match /^_/u.  @typescript-eslint/no-unused-vars
25:35  Warning: 'errorInfo' is defined but never used. Allowed unused args must match /^_/u.  @typescript-eslint/no-unused-vars
25:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./lib/validations/document.ts
85:50  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
Failed to compile.

./components/report-print-template.tsx:581:94
Type error: Property 'leftEyes' does not exist on type 'Diagnosis'. Did you mean 'leftEye'?

  579 |               {report.diagnosis.rightEye && <div><strong>OD:</strong> {report.diagnosis.rightEye}</div>}
  580 |               {report.diagnosis.leftEye && <div><strong>OS:</strong> {report.diagnosis.leftEye}</div>}
> 581 |               {!report.diagnosis.bothEyes && !report.diagnosis.rightEye && !report.diagnosis.leftEyes && (
      |                                                                                              ^
  582 |                 <div>—</div>
  583 |               )}
  584 |             </div>
Next.js build worker exited with code: 1 and signal: null
[PM2] Starting /usr/bin/npm in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ doctor-portal      │ fork     │ 568  │ online    │ 0%       │ 59.8mb   │
│ 1  │ mymd-main          │ fork     │ 0    │ online    │ 0%       │ 17.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
root@shannon:/var/www/mymd-main# Read from remote host 193.149.18.77: Operation timed out
Connection to 193.149.18.77 closed.
client_loop: send disconnect: Broken pipe
(base) ammarabduholiqov@ammar-2 ~ % 
