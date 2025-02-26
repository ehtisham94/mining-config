const readline = require('readline');
const { spawn } = require('child_process');

function askQuestion(prompt) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise(resolve => {
      rl.question(prompt, answer => {
        rl.close();
        resolve(answer);
      });
    });
  }
async function executeCommandWithTimeout(command, timeout=7000) {
    // console.log('executeCommandWithTimeout ');
    return new Promise(async (resolve, reject) => {
    //   console.log('start executing command');
      const childProcess = spawn(command, { shell: true, stdio: 'pipe' });
  
      let timedOut = false;
      let output = '';
  
      const timeoutId = setTimeout(() => {
        // console.log(`Command timed out after ${timeout} milliseconds`);
        timedOut = true;
        childProcess.kill();
        resolve({success: false, data: ''});
      }, timeout);
  
      // Capture the output
      childProcess.stdout.on('data', (data) => {
        // console.log(`received output chunk from command ${command}: `, data);
        output += data;
      });
  
      childProcess.on('exit', (code, signal) => {
        // console.log('exit', code, signal);
        clearTimeout(timeoutId);
  
        if (timedOut) {
        //   console.log(`Command '${command}' exited after timeout`);
          // Do nothing, already rejected due to timeout
        } else if (code === 0) {
        //   console.log(`Command '${command}' executed successfully with output: `, output);
          resolve({success: true, data: output});
        } else {
        //   console.log(`Command exited with code ${code || signal}`);
          resolve({success: false, data: ''});
        }
      });
  
      childProcess.on('error', (error) => {
        // console.log(`error in executing command ${command}: `, error);
        clearTimeout(timeoutId);
        resolve({success: false, data: ''});
      });
    });
}

async function startProgram() {
    try {
        let commandGroups = {
          // "temp": [
          //     `adb shell settings put system screen_brightness 255`,
          //     `adb shell settings put system screen_off_timeout 600000`,
          //     `adb shell input swipe 200 1150 300 400 300`,
          //     `adb shell input swipe 0 0 0 600 300`,
          //     `adb shell input swipe 195 195 195 195 1000`,
          //     `adb shell input tap 650 110`, // 3 dots
          //     `adb shell input tap 480 210`, // saved wifi button
          //     `adb shell input tap 275 200`, // 1st saved wifi
          //     `adb shell input tap 500 1270`, // forget button
          //     `adb shell input tap 50 100`, // back button
          //     `adb shell input tap 650 110`, // 3 dots
          //     `adb shell input tap 460 120`, // add wifi button
          //     `adb shell "input text 'A101'"`,
          //     `adb shell input tap 100 1075`, // security type button
          //     `adb shell input tap 200 1200`, // wpa/wpa2 psk button
          //     `adb shell "input text 'Aa1!1!1aA'"`,
          //     `adb shell input tap 500 1270`, // connect button
          //     `adb shell settings put system screen_off_timeout 15000`,
          //     `adb shell settings put system screen_brightness 0`,
          //   ],
            "Visible": [
              // `adb shell wm size 720x1560`,
              // `adb shell wm density 280`, // minimum 72
              `adb shell settings put system screen_brightness 255`,
              `adb shell settings put system screen_off_timeout 600000`,
            ],
            // "set Wifi": [
            //   `adb shell input swipe 200 1150 300 400 300`,
            //   `adb shell input swipe 0 0 0 600 300`,
            //   `adb shell input swipe 195 195 195 195 1000`,
            //   `adb shell input tap 650 110`, // 3 dots
            //   `adb shell input tap 480 210`, // saved wifi button
            //   `adb shell input tap 275 200`, // 1st saved wifi
            //   `adb shell input tap 500 1270`, // forget button
            //   `adb shell input tap 50 100`, // back button
            //   `adb shell input tap 650 110`, // 3 dots
            //   `adb shell input tap 460 120`, // add wifi button
            //   `adb shell "input text 'A101'"`,
            //   `adb shell input tap 100 1075`, // security type button
            //   `adb shell input tap 200 1200`, // wpa/wpa2 psk button
            //   `adb shell "input text 'Aa1!1!1aA'"`,
            //   // `adb shell input tap 500 700`, // connect button
            //   `adb shell input tap 500 1270`, // connect button
            // ],
            "Install apps": [
                `adb install ./Termux.apk`,
                `adb install ./Termux_API.apk`,
                `adb install ./com.termux.boot_7.apk`,
            ],
            "Prepare phone": [
              // `adb shell settings put global system_capabilities 100`,
              // `adb shell settings put global sem_enhanced_cpu_responsiveness 1`,
              // `adb shell settings put global adaptive_battery_management_enable 0`,
              // `adb shell settings put global adaptive_power_saving_setting 0`,
              `adb shell dumpsys deviceidle whitelist +com.termux`,
              `adb shell dumpsys deviceidle whitelist +com.termux.api`,
              `adb shell dumpsys deviceidle whitelist +com.termux.boot`,
              // // `adb shell dumpsys battery set level 100`,
              // `adb shell settings put global window_animation_scale 0`,
              // `adb shell settings put global transition_animation_scale 0`,
              // `adb shell settings put global animator_duration_scale 0`,
              // `adb shell su -c echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor`,
              // // `adb shell settings put global background_limit 4`,
              // // `adb shell wm size 720x1560`,
              // // `adb shell wm density 280`, // minimum 72
            ],
            "Install prerequisite for mining program" : [
                `adb shell cmd wifi add-network "D101" wpa2 "Aa1!4!1aA" -h`,
                `adb shell "input text 'D101'"`,
                `adb shell "input text 'Aa1!4!1aA'"`,
                // `adb shell "input text 'pkg update -y && pkg upgrade -y\n'"`,
                `adb shell "input text 'yes | pkg update && yes | pkg upgrade\n'"`,
                `adb shell "input text 'pkg install -y termux-api proot proot-distro openssh\n'"`,
                `adb shell "input text 'passwd\n'"`,
                `adb shell "input text '0000\n'"`,
                `adb shell "input text '0000\n'"`,
                `adb shell "input text 'sshd\n'"`,
                `adb shell "input text 'proot-distro install ubuntu\n'"`,
                `adb shell "input text 'proot-distro login ubuntu\n'"`,
            ],
            "Install mining manager": [
                `adb shell "input text 'yes | apt-get update && yes | apt-get upgrade\n'"`,
                `adb shell "input text 'apt-get install -y libcurl4-openssl-dev libjansson-dev libomp-dev git screen nano jq wget nodejs automake autotools-dev build-essential libssl-dev libgmp-dev\n'"`,
                `adb shell "input text '5\n'"`,
                `adb shell "input text '40\n'"`,
                `adb shell "input text '40\n'"`,
                `adb shell "input text 'curl -o- -k https://raw.githubusercontent.com/ehtisham94/Android-Mining/refs/heads/main/install3.1.sh | name=\'nameValue\' group=\'groupValue\' slot=slotValue bash\n'"`,
                // `adb shell "input text 'nano ccminer/config.json\n'"`,
                // `adb shell "input text '{ \\"version\\": \\"0.0\\", \\"configDataUrl\\": \\"https://raw.githubusercontent.com/ehtisham94/mining-config/main/config.json\\", \\"name\\": \\"nameValue\\", \\"group\\": \\"groupValue\\", \\"slot\\": slotValue }'"`,
                // `adb shell "input text 'x'"`,
                // `adb shell "input text 'y'"`,
                // `adb shell input keyevent ENTER`,
            ],
            "Prepare auto start": [
                // `adb shell "input text 'nano /etc/profile.d/start-ccminer.sh\n'"`,
                // `adb shell "input text 'nohup node ~/ccminer/sendBatteryStatus.js > /dev/null 2>&1 &'"`,
                // `adb shell "input text 'x'"`,
                // `adb shell "input text 'y'"`,
                // `adb shell input keyevent ENTER`,
                // `adb shell "input text 'chmod +x /etc/profile.d/start-ccminer.sh\n'"`,
                `adb shell "input text 'exit\n'"`,
                `adb shell "input text 'curl -o- -k https://raw.githubusercontent.com/ehtisham94/Android-Mining/refs/heads/main/install3.2.sh | bash\n'"`,
                // `adb shell "input text 'cd ~/.termux\n'"`,
                // `adb shell "input text 'mkdir boot\n'"`,
                // `adb shell "input text 'cd boot\n'"`,
                // `adb shell "input text 'nano start-ubuntu.sh\n'"`,
                // `adb shell "input text 'sshd'"`,
                // `adb shell input keyevent ENTER`,
                // `adb shell "input text 'termux-wake-lock'"`,
                // `adb shell input keyevent ENTER`,
                // `adb shell "input text 'proot-distro login ubuntu'"`,
                // `adb shell "input text 'x'"`,
                // `adb shell "input text 'y'"`,
                // `adb shell input keyevent ENTER`,
                // `adb shell "input text 'chmod +x ~/.termux/boot/start-ubuntu.sh\n'"`,
            ],
            "Reboot and hide": [
              // `adb shell wm size 200x400`,
              // `adb shell wm density 72`, // minimum 72
              `adb shell settings put system screen_off_timeout 15000`,
              `adb shell settings put system screen_brightness 0`,
              `adb reboot`,
            ],
        }
        let selectedGroup
        do {
            console.log(`All`);
            for (const property in commandGroups) {
                console.log(property);
            }
            console.log(`Exit`);
            selectedGroup = await askQuestion(`Please select command group : `)
            let commands = [`adb devices`]
            if (!!commandGroups[selectedGroup]) {
                commands = [...commands, ...commandGroups[selectedGroup]]
            }
            else if (selectedGroup == 'All') {
                for (const property in commandGroups) {
                    commands = [...commands, ...commandGroups[property]]
                }
            }
            let commandPrefix = await askQuestion(`Please type command prefix : `)
            if (!!commandPrefix) commands = commands.map(c => `${commandPrefix}${c}`)
            else commands = commands.map(c => c.replace(`\n'"`, `'" & adb shell input keyevent 66`))
            if (!!commandGroups[selectedGroup] || selectedGroup == 'All') {
                let repeat
                do {
                    for (let i = 0; i < commands.length; i++) {
                        console.log(`${i}. '${commands[i]}'`);
                    }
                    for (let i = 0; i < commands.length; i++) {
                        let command = commands[i], timedOut = command.includes('.apk') ? 60000 : 7000
                        if (command.includes('slot')) {
                            let name = await askQuestion(`name group slot : `)
                            let [_, num] = name.split('_')
                            num = parseInt(num)
                            let group = `00${parseInt(num / 8) + 1}`.slice(-3), slot = num % 8
                            // let [name, group, slot] = name.split(' ')
                            await executeCommandWithTimeout(`adb shell settings put global device_name "'${name}'"`, timedOut) // s8
                            // await executeCommandWithTimeout(`adb shell settings put system lg_device_name "'${name}'"`, timedOut) // v35
                            // await executeCommandWithTimeout(`adb shell settings list global`, timedOut)
                            // await executeCommandWithTimeout(`adb shell settings list system`, timedOut)
                            // await executeCommandWithTimeout(`adb shell settings list secure`, timedOut)
                            command = command.replace('nameValue', name).replace('groupValue', group).replace('slotValue', slot)
                        }
                        let commandResult = await executeCommandWithTimeout(command, timedOut)
                        let next = parseInt(await askQuestion(`\n'${command}' executed ${commandResult.success ? 'successfully' : 'with error'}.\nnext '${commands[i+1]}' : `))
                        if (parseInt(next)) {
                            i += parseInt(next)
                        }
                    }
                    repeat = await askQuestion(`Enter '0' for command group selection else continue to command group '${selectedGroup}' : `)
                } while (repeat != '0');
            }
        } while (selectedGroup != 'Exit');
    } catch (error) {
        console.log(1, error);
    }
}

startProgram()
