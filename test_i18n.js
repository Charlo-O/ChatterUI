// 简单的i18n测试脚本
const fs = require('fs');
const path = require('path');

console.log('测试国际化配置...\n');

// 读取英文翻译文件
const enPath = path.join(__dirname, 'app/locales/en/translation.json');
const zhPath = path.join(__dirname, 'app/locales/zh/translation.json');

try {
    const enTranslation = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const zhTranslation = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    
    console.log('✅ 英文翻译文件加载成功');
    console.log('✅ 中文翻译文件加载成功\n');
    
    // 检查关键翻译键是否存在
    const keyTests = [
        'common.about',
        'characters.editCharacter',
        'settings.themes',
        'dev.disableDevMode',
        'about.description'
    ];
    
    console.log('检查翻译键：');
    keyTests.forEach(key => {
        const keys = key.split('.');
        const enValue = keys.reduce((obj, k) => obj?.[k], enTranslation);
        const zhValue = keys.reduce((obj, k) => obj?.[k], zhTranslation);
        
        if (enValue && zhValue) {
            console.log(`✅ ${key}:`);
            console.log(`   EN: ${enValue}`);
            console.log(`   ZH: ${zhValue}`);
        } else {
            console.log(`❌ ${key}: 缺失翻译`);
        }
    });
    
    console.log('\n汉化配置检查完成！');
    
} catch (error) {
    console.error('❌ 错误:', error.message);
}