import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//自动按需引入 ant design vue
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
   // 静态文件路径
  /*
    loadEnv() 三个参数【https://cn.vitejs.dev/guide/api-javascript.html#loadenv】
    @mode：package.json中启动的时候，设置的 --mode <env> 会读取到 <env> 中的变量
    @envDir：.env.xxx文件的路径
    @prefixes：默认情况下只有前缀为 VITE_ 会被加载，除非更改了 prefixes 配置
               现在将前缀更改为BASE_URL，这样我们就可以获取运维在部署时，就可以获取到CDN加载静态资源的前缀了，
               这个BASE_URL是跟运维约定好的字段，实际要根据自己的项目进行判断
  */
  // 如果没有找到 BASE_URL ，就使用 ./ 的目录
  const staticPath = loadEnv(mode, "./", "BASE_URL").BASE_URL || "./";
  return {
      base: mode == "dev" ? "./" : staticPath,
      build: {
        assetsDir: "static", // 静态资源导出的文件名
      },
      plugins: [
        Components({
          resolvers: [AntDesignVueResolver()]
        }),
        vue(),
      ],
      resolve: {
        // 设置别名
        alias: {
          '@': path.resolve(__dirname, 'src')
        }
      },
      proxy:{
        'api':{
           target:"http://localhost:8080/",
           changeOrigin:true,
           rewrite: (path) => path.replace(/^\/api/, ""),
        }
      },
      define: {
        'process.env': {}
      },
      server:{
        host:"localhost",
        port:80,
        https:false,
        open:true,//自动打开窗口
      },
   }
});
