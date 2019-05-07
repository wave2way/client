const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
     libraryDirectory: 'es',
     style: 'true',
   }),
   addLessLoader({
        javascriptEnabled: true,
        modifyVars: { 
            '@primary-color': '#1890ff',
            '@link-color': "#1890ff",
            "@heading-color": "#FFF",
            "@border-radius-base": "8px",
            "@font-size-base": "14px"
        },
    }),
);