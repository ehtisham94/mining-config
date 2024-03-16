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
      let branches = {
        'stylo5': 'a53',
        's8': 'a73-a53',
        'v30': 'a73-a53',
        'v30+': 'a73-a53',
        'v35': 'a75-a55',
        'v40': 'a75-a55',
        'v50': 'a76-a55',
        'g8': 'a76-a55',
        'g8x': 'a76-a55',
        'velvet': 'a76-a55',
      }
        let commandGroups = {
            "Install apps": [
              `./adb install ./Termux.apk`,
              `./adb install ./Termux_API.apk`,
              `./adb install ./com.termux.boot_7.apk`,
            ],
            "Prepare phone": [
              `./adb shell settings put system screen_brightness 255`,
              `./adb shell settings put system screen_off_timeout 600000`,
              `./adb shell settings put global system_capabilities 100`,
              `./adb shell settings put global sem_enhanced_cpu_responsiveness 1`,
              `./adb shell settings put global adaptive_battery_management_enable 0`,
              `./adb shell settings put global adaptive_power_saving_setting 0`,
              `./adb shell dumpsys deviceidle whitelist +com.termux`,
              `./adb shell dumpsys deviceidle whitelist +com.termux.api`,
              `./adb shell dumpsys deviceidle whitelist +com.termux.boot`,
              // `./adb shell dumpsys battery set level 100`,
              `./adb shell settings put global window_animation_scale 0`,
              `./adb shell settings put global transition_animation_scale 0`,
              `./adb shell settings put global animator_duration_scale 0`,
              `./adb shell su -c echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor`,
              // `./adb shell settings put global background_limit 4`,
              // `./adb shell wm size 720x1560`,
              // `./adb shell wm density 280`, // minimum 72
            ],
            "Install prerequisite for mining program" : [
              `./adb shell "input text 'pkg update -y && pkg upgrade -y\n'"`,
              `./adb shell "input text 'pkg install -y libjansson wget nano screen nodejs termux-api\n'"`,
            ],
            "Install ccminer": [
              `./adb shell "input text 'mkdir ccminer\n'"`,
              `./adb shell "input text 'cd ccminer\n'"`,
              `./adb shell "input text 'wget https://raw.githubusercontent.com/ehtisham94/Android-Mining/main/start.sh\n'"`,
              `./adb shell "input text 'wget https://raw.githubusercontent.com/ehtisham94/Android-Mining/main/sendBatteryStatus.js\n'"`,
              `./adb shell "input text 'wget https://raw.githubusercontent.com/ehtisham94/Android-Mining/main/config.json\n'"`,
              `./adb shell "input text 'nano config.json\n'"`,
              `./adb shell "input text '{ \\"version\\": \\"0.0.0\\", \\"configDataUrl\\": \\"https://raw.githubusercontent.com/ehtisham94/mining-config/main/config.json\\", \\"name\\": \\"nameValue\\", \\"group\\": \\"groupValue\\", \\"slot\\": slotValue }'"`,
              `./adb shell "input text 'x'"`,
              `./adb shell "input text 'y'"`,
              `./adb shell input keyevent ENTER`,
              `./adb shell "input text 'wget https://raw.githubusercontent.com/Darktron/pre-compiled/generic/ccminer\n'"`,
              `./adb shell "input text 'chmod +x ccminer start.sh sendBatteryStatus.js\n'"`,
            ],
            "Prepare auto start": [
              `./adb shell "input text 'cd ~/.termux\n'"`,
              `./adb shell "input text 'mkdir boot\n'"`,
              `./adb shell "input text 'cd boot\n'"`,
              `./adb shell "input text 'nano start-ccminer.sh\n'"`,
              `./adb shell "input text 'termux-wake-lock'"`,
              `./adb shell input keyevent ENTER`,
              `./adb shell "input text 'nohup node ~/ccminer/sendBatteryStatus.js > /dev/null 2>&1 &'"`,
              `./adb shell "input text 'x'"`,
              `./adb shell "input text 'y'"`,
              `./adb shell input keyevent ENTER`,
              `./adb shell "input text 'chmod +x ~/.termux/boot/start-ccminer.sh\n'"`,
              `./adb shell "input text 'cd\n'"`,
              `./adb shell "input text 'nano .profile\n'"`,
              `./adb shell "input text 'termux-wake-lock'"`,
              `./adb shell input keyevent ENTER`,
              `./adb shell "input text 'nohup node ~/ccminer/sendBatteryStatus.js > /dev/null 2>&1 &'"`,
              `./adb shell "input text 'x'"`,
              `./adb shell "input text 'y'"`,
              `./adb shell input keyevent ENTER`,
              `./adb shell "input text 'chmod +x .profile\n'"`,
              `./adb shell "input text 'exit\n'"`,
            ],
            "Reboot": [
              `./adb reboot`,
              `./adb shell wm size 200x400`,
              `./adb shell wm density 72`, // minimum 72
              `./adb shell settings put system screen_brightness 0`,
              `./adb shell settings put system screen_off_timeout 15000`,
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
            let commands = [`./adb devices`]
            if (!!commandGroups[selectedGroup]) {
                commands = [...commands, ...commandGroups[selectedGroup]]
            }
            else if (selectedGroup == 'All') {
                for (const property in commandGroups) {
                    commands = [...commands, ...commandGroups[property]]
                }
            }
            if (!!commandGroups[selectedGroup] || selectedGroup == 'All') {
                let repeat
                do {
                    for (let i = 0; i < commands.length; i++) {
                        console.log(`${i}. '${commands[i]}'`);
                    }
                    let branch = ''
                    for (let i = 0; i < commands.length; i++) {
                        let command = commands[i], timedOut = command.includes('.apk') ? 60000 : 7000
                        if (command.includes('slot')) {
                            let input = await askQuestion(`name group slot : `)
                            let [name, group, slot] = input.split(' ')
                            command = command.replace('nameValue', name).replace('groupValue', group).replace('slotValue', slot)
                            branch = branches[name.split('_')[0]]
                        }
                        else if (command.includes('generic')) {
                            command = command.replace('generic', branch)
                        }
                        let commandResult = await executeCommandWithTimeout(command, timedOut)
                        let next = parseInt(await askQuestion(`'${command}' executed ${commandResult.success ? 'successfully' : 'with error'}. next : `))
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
