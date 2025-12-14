/**
 * Server Side Logic for DemoOS
 * RPC経由で呼び出される関数群
 */

const KEY_CONFIG = 'DEMO_OS_CONFIG';

function getInitialData() {
  const jsonConfig = BIOS_exports.ScriptProperties.getProperty(KEY_CONFIG);
  
  const objDefault = {
    clock1: { name: 'Japan (JST)', offset: 9 },
    clock2: { name: 'UTC', offset: 0 }
  };

  const objSettings = jsonConfig ? JSON.parse(jsonConfig) : objDefault;
  const msNow = new Date().getTime();

  return {
    msServerTime: msNow,
    objSettings: objSettings
  };
}

function saveSettings(objConfig) {
  if (!objConfig) return false;
  const jsonString = JSON.stringify(objConfig);
  BIOS_exports.ScriptProperties.setProperty(KEY_CONFIG, jsonString);
  return true;
}