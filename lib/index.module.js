var t={props:{url:{type:String,default:""},lineNum:{type:Number,default:4},lineSpace:{type:Number,default:30},parentList:{type:Array,default:()=>[]},itemProps:{type:Object,default:()=>({})},needItemImage:{type:Boolean,default:!0},authorInfo:{type:Object,default:()=>({})}},data(){return{list:[],lineMaxHeightList:Array(this.lineNum).fill(null).map((()=>0)),speed:Array(this.lineNum).fill(0).map(((t,e)=>({speed:(.2*Math.random()+1.5).toFixed(4),row:e+1}))),imgList:[{name:"莲花",id:1,url:"https://image.brightfuture360.com/static/temple/randeng/box-1.png",dom:null,fontSize:26,rate:4}],canvasWidth:null,drawIng:!1,authorImg:null,stamp:null,dpr:1,rem2px:50}},created(){process.client&&(this.lineList=Array(this.lineNum).fill(null).map((()=>[])),this.drawList=[])},mounted(){this.initData()},methods:{async initData(){if(this.canvasWidth=this.$refs.brrageCanvas.getBoundingClientRect().width*this.dpr>750?750:this.$refs.brrageCanvas.getBoundingClientRect().width*this.dpr,this.canvasHeight=this.$refs.brrageCanvas.getBoundingClientRect().height*this.dpr>750?750:this.$refs.brrageCanvas.getBoundingClientRect().height*this.dpr,this.rem2px=+window.getComputedStyle(document.documentElement).fontSize.slice(0,-2),this.$refs.brrageCanvas.width=this.canvasWidth,this.$refs.brrageCanvas.height=this.canvasHeight,this.ctx=this.$refs.brrageCanvas.getContext("2d"),this.ctx.scale(this.dpr,this.dpr),this.needItemImage){const t=this.imgList.map((t=>{const e=new Image;return e.crossOrigin="Anonymous",e.src=t.url,new Promise((n=>{e.onload=()=>{t.dom=e,n(t)}}))}));await Promise.all(t).then((t=>{this.imgList=t}))}this.list=this.parentList,this.list.forEach((t=>{this.appendItem(t)})),this.draw()},getRow(){const t=this.lineList.findIndex((t=>0===t.length));if(t>-1)return t+1;return this.lineList.map((t=>t[t.length-1])).reduce(((t,e)=>(t?t.left+t.canvas.width>e.left+e.canvas.width&&(t=e):t=e,t)),null).row},getSpeed(t){return this.speed.find((e=>e.row===t)).speed},getImage(){return this.imgList[Math.floor(Math.random()*this.imgList.length)]},draw(t){this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);for(let e=0;e<this.drawList.length;e++){const n=this.drawList[e];if(n){if(n.left<-n.canvas.width)this.drawList.splice(e,1,null),this.lineList[n.row-1].splice(0,1),this.appendItem(n);else if(this.stamp&&t){const e=t-this.stamp;n.left-=n.speed/16*e}else n.left-=n.speed;this.$nextTick((()=>{this.ctx.drawImage(n.canvas,Math.floor(n.left),n.top)}))}}this.stamp=t,window.requestAnimationFrame(this.draw)},getTop(t){let e=0;if(1===t)e=0;else{for(let n=0;n<t-1;n++)e+=this.lineMaxHeightList[n];e+=(t-1)*this.lineSpace}return e},async appendItem(t){const e=this.needItemImage?this.getImage():{};if(!t.canvas){let n=t[this.itemProps.defaultProps.text]||t.wish;const i=t.userId==this.authorInfo.userId;i&&(n=this.authorInfo.username+"："+n);const r=await this.createCanvasImg(e.dom,e.fontSize||this.itemProps.defaultProps.fontSize,n&&n.length>19?n.slice(0,20)+"...":n,e.rate,i);t.canvas=r}const n=this.getRow(),i=this.getSpeed(n),r=this.getTop(n);if(t.row=n,t.speed=i,this.lineList[n-1].length){const e=this.lineList[n-1].slice(-1)[0];t.top=r,e.left+e.canvas.width<this.canvasWidth?t.left=this.canvasWidth+10:t.left=e.left+e.canvas.width+10}else t.top=r,t.left=this.canvasWidth;this.lineMaxHeightList[n-1]<t.canvas.height&&(this.lineMaxHeightList[n-1]=t.canvas.height),this.lineList[n-1].push(t),this.drawList.push(t)},async createCanvasImg(t,e,n,i=3,r){const a=this.rem2px/100,s=document.createElement("canvas"),h=s.getContext("2d");e*=a,h.font=`${e}px serif`;const o=h.measureText(n).width,d=60*a,l=76*a+o+(r?92*a:0),c=d/2;let m=0;if(s.height=d,t)if(o<l)s.width=2*l+o,h.drawImage(t,0,0,l,d,0,0,l,d),h.drawImage(t,l,0,o,d,l,0,o,d),h.drawImage(t,l*(i-1),0,l,d,l+o,0,l,d);else{m=Math.ceil(o/l),s.width=2*l+m*l+(o-m*l),h.drawImage(t,0,0,l,d,0,0,l,d);for(let e=0;e<m;e++)e===m-1&&o-e*l<l?h.drawImage(t,l,0,o-e*l,d,l*(e+1),0,o-e*l,d):h.drawImage(t,l,0,l,d,l*(e+1),0,l,d);h.drawImage(t,l*(i-1),0,l,d,l+o,0,l,d)}else s.width=l,h.fillStyle=r?this.itemProps.specialProps.backgroundColor:this.itemProps.defaultProps.backgroundColor,h.beginPath(),h.arc(c,c,c,Math.PI/2,1.5*Math.PI),h.lineTo(r?c+o+38*a:c+o,0),h.arc(r?c+o+38*a:c+o,c,c,1.5*Math.PI,Math.PI/2),h.lineTo(c,d),h.closePath(),h.fill();if(h.fillStyle=(r?this.itemProps.specialProps.color:this.itemProps.defaultProps.color)||"#000000",h.font=`${e}px serif`,!this.needItemImage&&r){let t=null;this.authorImg?t=this.authorImg:(t=await this.clipImg(this.authorInfo.useravatar||"https://static.zhimingfoxue.com/templeimg/20220411172932t6eojh.png",38*a,38*a,"cover",19*a),this.authorImg=t);const i=new Image;i.src=src,await new Promise((t=>{i.onload=()=>{t()}})),h.drawImage(t,c,Math.ceil(e/4),38*a,38*a),h.drawImage(i,c+26*a,Math.ceil(e/4)+25*a,13*a,13*a),h.fillText(n,this.needItemImage?(s.width-o)/2:c+46*a,c+Math.ceil(e/4))}else h.fillText(n,this.needItemImage?(s.width-o)/2:c,c+Math.ceil(e/4));return s},clipImg:(t,e,n,i,r)=>new Promise((a=>{const s=document.createElement("canvas");s.width=e,s.height=n;const h=s.getContext("2d"),o=new Image;o.onload=()=>{const t=o.width/o.height,d=e/n;r&&Math.min(e,n)/2>=r&&(h.beginPath(),h.moveTo(0,r),h.arc(r,r,r,-Math.PI,-Math.PI/2),h.lineTo(e-r,0),h.arc(e-r,r,r,-Math.PI/2,0),h.lineTo(e,n-r),h.arc(e-r,n-r,r,0,Math.PI/2),h.lineTo(r,n),h.arc(r,n-r,r,Math.PI/2,Math.PI),h.lineTo(0,r),h.clip()),"cover"===i&&(t>d?h.drawImage(o,(o.width-d*o.height)/2,0,d*o.height,o.height,0,0,e,n):h.drawImage(o,0,(o.height-o.width/d)/2,o.width,o.width/d,0,0,e,n)),a(s)},o.src=t}))}};function e(t,e,n,i,r,a,s,h,o,d){"boolean"!=typeof s&&(o=h,h=s,s=!1);const l="function"==typeof n?n.options:n;let c;if(t&&t.render&&(l.render=t.render,l.staticRenderFns=t.staticRenderFns,l._compiled=!0,r&&(l.functional=!0)),i&&(l._scopeId=i),a?(c=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),e&&e.call(this,o(t)),t&&t._registeredComponents&&t._registeredComponents.add(a)},l._ssrRegister=c):e&&(c=s?function(t){e.call(this,d(t,this.$root.$options.shadowRoot))}:function(t){e.call(this,h(t))}),c)if(l.functional){const t=l.render;l.render=function(e,n){return c.call(n),t(e,n)}}else{const t=l.beforeCreate;l.beforeCreate=t?[].concat(t,c):[c]}return n}const n="undefined"!=typeof navigator&&/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());function i(t){return(t,e)=>function(t,e){const i=n?e.media||"default":t,s=a[i]||(a[i]={ids:new Set,styles:[]});if(!s.ids.has(t)){s.ids.add(t);let n=e.source;if(e.map&&(n+="\n/*# sourceURL="+e.map.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e.map))))+" */"),s.element||(s.element=document.createElement("style"),s.element.type="text/css",e.media&&s.element.setAttribute("media",e.media),void 0===r&&(r=document.head||document.getElementsByTagName("head")[0]),r.appendChild(s.element)),"styleSheet"in s.element)s.styles.push(n),s.element.styleSheet.cssText=s.styles.filter(Boolean).join("\n");else{const t=s.ids.size-1,e=document.createTextNode(n),i=s.element.childNodes;i[t]&&s.element.removeChild(i[t]),i.length?s.element.insertBefore(e,i[t]):s.element.appendChild(e)}}}(t,e)}let r;const a={};const s=t;var h=function(){var t=this.$createElement;return(this._self._c||t)("canvas",{ref:"brrageCanvas",staticClass:"canvas"})};h._withStripped=!0;const o=e({render:h,staticRenderFns:[]},(function(t){t&&t("data-v-0a3bd054_0",{source:'.canvas {\n  width: 7.5rem;\n  height: 10rem;\n}\n.box-0 {\n  display: flex;\n  justify-content: flex-start;\n}\n.box-0 .content {\n  text-align: center;\n  height: 72px;\n  line-height: 72px;\n  background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat center top/300% 72px;\n  white-space: nowrap;\n}\n.box-0::before {\n  display: block;\n  overflow: hidden;\n  content: "";\n  width: 100px;\n  height: 72px;\n  background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat left top/375px 72px;\n}\n.box-0::after {\n  display: block;\n  overflow: hidden;\n  content: "";\n  width: 100px;\n  height: 72px;\n  background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat right top/375px 72px;\n}\n\n/*# sourceMappingURL=canvasBarrage.vue.map */',map:{version:3,sources:["E:\\work\\z-canvas-barrage\\src\\canvasBarrage.vue","canvasBarrage.vue"],names:[],mappings:"AAmZA;EACA,aAAA;EACA,aAAA;AClZA;ADoZA;EACA,aAAA;EACA,2BAAA;ACjZA;ADkZA;EACA,kBAAA;EACA,YAAA;EACA,iBAAA;EACA,iHAAA;EACA,mBAAA;AChZA;ADkZA;EACA,cAAA;EACA,gBAAA;EACA,WAAA;EACA,YAAA;EACA,YAAA;EACA,gHAAA;AChZA;ADkZA;EACA,cAAA;EACA,gBAAA;EACA,WAAA;EACA,YAAA;EACA,YAAA;EACA,iHAAA;AChZA;;AAEA,4CAA4C",file:"canvasBarrage.vue",sourcesContent:["\x3c!--\r\n * @Author: zmx\r\n * @Date: 2022-10-14 10:20:49\r\n * @LastEditors: zmx\r\n * @LastEditTime: 2022-10-20 10:29:15\r\n * @Description: canvas 佛学弹幕墙\r\n--\x3e\r\n<template>\r\n  <canvas ref=\"brrageCanvas\" class=\"canvas\"></canvas>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  props: {\r\n    url: {\r\n      type: String,\r\n      default: '',\r\n    },\r\n    lineNum: {\r\n      type: Number,\r\n      default: 4,\r\n    },\r\n    lineSpace: {\r\n      type: Number,\r\n      default: 30,\r\n    },\r\n    parentList: {\r\n      type: Array,\r\n      default: () => [],\r\n    },\r\n    itemProps: {\r\n      type: Object,\r\n      default: () => ({}),\r\n    },\r\n    // 是否需要背景图\r\n    needItemImage: {\r\n      type: Boolean,\r\n      default: true,\r\n    },\r\n    authorInfo: {\r\n      type: Object,\r\n      default: () => ({}),\r\n    },\r\n  },\r\n  data() {\r\n    return {\r\n      list: [],\r\n      lineMaxHeightList: Array(this.lineNum)\r\n        .fill(null)\r\n        .map(() => {\r\n          return 0\r\n        }),\r\n      speed: Array(this.lineNum)\r\n        .fill(0)\r\n        .map((item, index) => {\r\n          return { speed: (Math.random() * 0.2 + 1.5).toFixed(4), row: index + 1 }\r\n        }),\r\n      // 随机选取的背景图片数组\r\n      imgList: [\r\n        {\r\n          name: '莲花',\r\n          id: 1,\r\n          url: 'https://image.brightfuture360.com/static/temple/randeng/box-1.png',\r\n          dom: null,\r\n          fontSize: 26,\r\n          rate: 4,\r\n        },\r\n      ],\r\n      canvasWidth: null,\r\n      drawIng: false,\r\n      authorImg: null,\r\n      stamp: null,\r\n      dpr: 1,\r\n      rem2px: 50,\r\n    }\r\n  },\r\n  created() {\r\n    if (process.client) {\r\n      this.lineList = Array(this.lineNum)\r\n        .fill(null)\r\n        .map(() => {\r\n          return []\r\n        })\r\n      this.drawList = []\r\n    }\r\n  },\r\n  mounted() {\r\n    this.initData()\r\n  },\r\n  methods: {\r\n    async initData() {\r\n      // this.dpr = window.devicePixelRatio\r\n      this.canvasWidth = this.$refs.brrageCanvas.getBoundingClientRect().width * this.dpr > 750? 750 :this.$refs.brrageCanvas.getBoundingClientRect().width * this.dpr\r\n      this.canvasHeight = this.$refs.brrageCanvas.getBoundingClientRect().height * this.dpr >750 ? 750 :this.$refs.brrageCanvas.getBoundingClientRect().height * this.dpr\r\n      this.rem2px = +window.getComputedStyle(document.documentElement).fontSize.slice(0, -2)\r\n      this.$refs.brrageCanvas.width = this.canvasWidth\r\n      this.$refs.brrageCanvas.height = this.canvasHeight\r\n      this.ctx = this.$refs.brrageCanvas.getContext('2d')\r\n      this.ctx.scale(this.dpr,this.dpr)\r\n      if (this.needItemImage) {\r\n        const _imgList = this.imgList.map((item) => {\r\n          const img = new Image()\r\n          img.crossOrigin = 'Anonymous'\r\n          img.src = item.url\r\n          return new Promise((resolve) => {\r\n            img.onload = () => {\r\n              item.dom = img\r\n              resolve(item)\r\n            }\r\n          })\r\n        })\r\n        await Promise.all(_imgList).then((imgList) => {\r\n          this.imgList = imgList\r\n        })\r\n      }\r\n\r\n      this.list = this.parentList\r\n      this.list.forEach((item) => {\r\n        this.appendItem(item)\r\n      })\r\n      this.draw()\r\n    },\r\n    getRow() {\r\n      const nullIndex = this.lineList.findIndex((item) => {\r\n        return item.length === 0\r\n      })\r\n      if (nullIndex > -1) {\r\n        return nullIndex + 1\r\n      } else {\r\n        // 拿到每行最后一个元素\r\n        const lastItemList = this.lineList.map((item) => {\r\n          return item[item.length - 1]\r\n        })\r\n        // 寻找元素left + width 最小值\r\n        const min = lastItemList.reduce((init, current) => {\r\n          if (!init) {\r\n            init = current\r\n          } else if (init.left + init.canvas.width > current.left + current.canvas.width) {\r\n            init = current\r\n          }\r\n          return init\r\n        }, null)\r\n        return min.row\r\n      }\r\n    },\r\n    getSpeed(row) {\r\n      return this.speed.find((item) => {\r\n        return item.row === row\r\n      }).speed\r\n    },\r\n    getImage() {\r\n      return this.imgList[Math.floor(Math.random() * this.imgList.length)]\r\n    },\r\n    draw(time) {\r\n      // if (!this.drawList.length) return\r\n      // this.drawIng = true\r\n      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)\r\n      for (let i = 0; i < this.drawList.length; i++) {\r\n        const item = this.drawList[i]\r\n        if (item) {\r\n          if (item.left < -item.canvas.width) {\r\n            this.drawList.splice(i, 1, null)\r\n            this.lineList[item.row - 1].splice(0, 1)\r\n            this.appendItem(item)\r\n          } else if (this.stamp && time) {\r\n            const delay = time - this.stamp\r\n            item.left -= (item.speed / 16) * delay\r\n          } else {\r\n            item.left -= item.speed\r\n          }\r\n          this.$nextTick(()=>{\r\n            this.ctx.drawImage(item.canvas, Math.floor(item.left), item.top)\r\n          })\r\n          \r\n        }\r\n      }\r\n      this.stamp = time\r\n      window.requestAnimationFrame(this.draw)\r\n    },\r\n    getTop(row) {\r\n      let top = 0\r\n      if (row === 1) {\r\n        top = 0\r\n      } else {\r\n        for (let i = 0; i < row - 1; i++) {\r\n          top += this.lineMaxHeightList[i]\r\n        }\r\n        top += (row - 1) * this.lineSpace\r\n      }\r\n      return top\r\n    },\r\n    async appendItem(item) {\r\n      const img = this.needItemImage ? this.getImage() : {}\r\n      if (!item.canvas) {\r\n        let wish = item[this.itemProps.defaultProps.text] || item.wish\r\n        const special = item.userId == this.authorInfo.userId\r\n        if (special) {\r\n          wish = this.authorInfo.username + '：' + wish\r\n        }\r\n        const canvas = await this.createCanvasImg(\r\n          img.dom,\r\n          img.fontSize || this.itemProps.defaultProps.fontSize,\r\n          wish && wish.length > 19 ? wish.slice(0, 20) + '...' : wish,\r\n          img.rate,\r\n          special\r\n        )\r\n        item.canvas = canvas\r\n      }\r\n      const row = this.getRow()\r\n      const speed = this.getSpeed(row)\r\n      const top = this.getTop(row)\r\n      item.row = row\r\n      item.speed = speed\r\n      // 生成canvas\r\n      // 决定item开始滚动的x坐标\r\n      if (!this.lineList[row - 1].length) {\r\n        item.top = top\r\n        item.left = this.canvasWidth\r\n      } else {\r\n        const last = this.lineList[row - 1].slice(-1)[0]\r\n        item.top = top\r\n        if (last.left + last.canvas.width < this.canvasWidth) {\r\n          item.left = this.canvasWidth + 10\r\n        } else {\r\n          item.left = last.left + last.canvas.width + 10\r\n        }\r\n      }\r\n      // console.log(item.left)\r\n      // 添加的时候 更新每一行的最高的那个canvas\r\n      if (this.lineMaxHeightList[row - 1] < item.canvas.height) {\r\n        // if(this.lineMaxHeightList[row] !==0 ){\r\n        //   item.top = top - (item.canvas.height - this.lineMaxHeightList[row - 1])/2\r\n        // }\r\n        this.lineMaxHeightList[row - 1] = item.canvas.height\r\n      }\r\n      this.lineList[row - 1].push(item)\r\n      this.drawList.push(item)\r\n    },\r\n    // 创建canvas\r\n    async createCanvasImg(img, fontSize, wish, rate = 3, isSpeciel) {\r\n      // const paddingW = +this.itemProps.defaultProps.padding.split('-')[1]\r\n      const px = this.rem2px / 100\r\n      // const paddingH = +this.itemProps.defaultProps.padding.split('-')[0]\r\n      const canvas = document.createElement('canvas')\r\n      const ctx = canvas.getContext('2d')\r\n      fontSize = fontSize * px\r\n      ctx.font = `${fontSize}px serif`\r\n      const fontWidth = ctx.measureText(wish).width\r\n      // const height = img ? img.height : paddingH * 2 * px + +fontSize\r\n      const height = 60 * px\r\n      const width = 38 * 2 * px + fontWidth + (isSpeciel ? 46 * 2 * px : 0)\r\n      // 无背景图片时 背景的圆角半径\r\n      const radio = height / 2\r\n      let num = 0\r\n      canvas.height = height\r\n      if (img) {\r\n        if (fontWidth < width) {\r\n          canvas.width = width * 2 + fontWidth\r\n          ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height)\r\n          ctx.drawImage(img, width, 0, fontWidth, height, width, 0, fontWidth, height)\r\n          ctx.drawImage(img, width * (rate - 1), 0, width, height, width + fontWidth, 0, width, height)\r\n        } else {\r\n          num = Math.ceil(fontWidth / width)\r\n          canvas.width = width * 2 + num * width + (fontWidth - num * width)\r\n          ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height)\r\n          for (let i = 0; i < num; i++) {\r\n            if (i === num - 1 && fontWidth - i * width < width) {\r\n              ctx.drawImage(\r\n                img,\r\n                width,\r\n                0,\r\n                fontWidth - i * width,\r\n                height,\r\n                width * (i + 1),\r\n                0,\r\n                fontWidth - i * width,\r\n                height\r\n              )\r\n            } else {\r\n              ctx.drawImage(img, width, 0, width, height, width * (i + 1), 0, width, height)\r\n            }\r\n          }\r\n          ctx.drawImage(img, width * (rate - 1), 0, width, height, width + fontWidth, 0, width, height)\r\n        }\r\n      } else {\r\n        canvas.width = width\r\n        ctx.fillStyle = isSpeciel\r\n          ? this.itemProps.specialProps.backgroundColor\r\n          : this.itemProps.defaultProps.backgroundColor\r\n        ctx.beginPath()\r\n        ctx.arc(radio, radio, radio, Math.PI / 2, (3 / 2) * Math.PI)\r\n        ctx.lineTo(isSpeciel ? radio + fontWidth + 38 * px : radio + fontWidth, 0)\r\n        ctx.arc(\r\n          isSpeciel ? radio + fontWidth + 38 * px : radio + fontWidth,\r\n          radio,\r\n          radio,\r\n          (3 / 2) * Math.PI,\r\n          Math.PI / 2\r\n        )\r\n        ctx.lineTo(radio, height)\r\n        ctx.closePath()\r\n        ctx.fill()\r\n      }\r\n      ctx.fillStyle = (isSpeciel ? this.itemProps.specialProps.color : this.itemProps.defaultProps.color) || '#000000'\r\n      ctx.font = `${fontSize}px serif`\r\n      if (!this.needItemImage && isSpeciel) {\r\n        let img = null\r\n        if (!this.authorImg) {\r\n          img = await this.clipImg(\r\n            this.authorInfo.useravatar || 'https://static.zhimingfoxue.com/templeimg/20220411172932t6eojh.png',\r\n            38 * px,\r\n            38 * px,\r\n            'cover',\r\n            19 * px\r\n          )\r\n          this.authorImg = img\r\n        } else {\r\n          img = this.authorImg\r\n        }\r\n        const imgV = new Image()\r\n        imgV.src = src\r\n        await new Promise((resolve) => {\r\n          imgV.onload = () => {\r\n            resolve()\r\n          }\r\n        })\r\n        ctx.drawImage(img, radio, Math.ceil(fontSize / 4), 38 * px, 38 * px)\r\n        ctx.drawImage(imgV, radio + 26 * px, Math.ceil(fontSize / 4) + 25 * px, 13 * px, 13 * px)\r\n        ctx.fillText(\r\n          wish,\r\n          !this.needItemImage ? radio + 46 * px : (canvas.width - fontWidth) / 2,\r\n          radio + Math.ceil(fontSize / 4)\r\n        )\r\n      } else {\r\n        ctx.fillText(\r\n          wish,\r\n          !this.needItemImage ? radio : (canvas.width - fontWidth) / 2,\r\n          radio + Math.ceil(fontSize / 4)\r\n        )\r\n      }\r\n      return canvas\r\n    },\r\n    clipImg(src, width, height, mode, radius) {\r\n      return new Promise((resolve) => {\r\n        const canvas = document.createElement('canvas')\r\n        canvas.width = width\r\n        canvas.height = height\r\n        const ctx = canvas.getContext('2d')\r\n        const img = new Image()\r\n        // img.crossOrigin = ''\r\n        img.onload = () => {\r\n          const irate = img.width / img.height\r\n          const rate = width / height\r\n          if (radius && Math.min(width, height) / 2 >= radius) {\r\n            ctx.beginPath()\r\n            ctx.moveTo(0, radius)\r\n            ctx.arc(radius, radius, radius, -Math.PI, -Math.PI / 2)\r\n            ctx.lineTo(width - radius, 0)\r\n            ctx.arc(width - radius, radius, radius, -Math.PI / 2, 0)\r\n            ctx.lineTo(width, height - radius)\r\n            ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2)\r\n            ctx.lineTo(radius, height)\r\n            ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)\r\n            ctx.lineTo(0, radius)\r\n            ctx.clip()\r\n          }\r\n          if (mode === 'cover') {\r\n            if (irate > rate) {\r\n              ctx.drawImage(\r\n                img,\r\n                (img.width - rate * img.height) / 2,\r\n                0,\r\n                rate * img.height,\r\n                img.height,\r\n                0,\r\n                0,\r\n                width,\r\n                height\r\n              )\r\n            } else {\r\n              ctx.drawImage(\r\n                img,\r\n                0,\r\n                (img.height - img.width / rate) / 2,\r\n                img.width,\r\n                img.width / rate,\r\n                0,\r\n                0,\r\n                width,\r\n                height\r\n              )\r\n            }\r\n          }\r\n          resolve(canvas)\r\n        }\r\n        img.src = src\r\n      })\r\n    },\r\n  },\r\n}\r\n<\/script>\r\n\r\n<style lang=\"scss\" scopd>\r\n.canvas {\r\n  width: 7.5rem;\r\n  height: 10rem;\r\n}\r\n.box-0 {\r\n  display: flex;\r\n  justify-content: flex-start;\r\n  .content {\r\n    text-align: center;\r\n    height: 72px;\r\n    line-height: 72px;\r\n    background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat center top/300% 72px;\r\n    white-space: nowrap;\r\n  }\r\n  &::before {\r\n    display: block;\r\n    overflow: hidden;\r\n    content: '';\r\n    width: 100px;\r\n    height: 72px;\r\n    background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat left top/375px 72px;\r\n  }\r\n  &::after {\r\n    display: block;\r\n    overflow: hidden;\r\n    content: '';\r\n    width: 100px;\r\n    height: 72px;\r\n    background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat right top/375px 72px;\r\n  }\r\n}\r\n</style>\r\n",'.canvas {\n  width: 7.5rem;\n  height: 10rem;\n}\n\n.box-0 {\n  display: flex;\n  justify-content: flex-start;\n}\n.box-0 .content {\n  text-align: center;\n  height: 72px;\n  line-height: 72px;\n  background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat center top/300% 72px;\n  white-space: nowrap;\n}\n.box-0::before {\n  display: block;\n  overflow: hidden;\n  content: "";\n  width: 100px;\n  height: 72px;\n  background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat left top/375px 72px;\n}\n.box-0::after {\n  display: block;\n  overflow: hidden;\n  content: "";\n  width: 100px;\n  height: 72px;\n  background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat right top/375px 72px;\n}\n\n/*# sourceMappingURL=canvasBarrage.vue.map */']},media:void 0})}),s,undefined,false,undefined,!1,i,void 0,void 0);export{o as default};