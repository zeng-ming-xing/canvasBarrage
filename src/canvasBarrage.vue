<!--
 * @Author: zmx
 * @Date: 2022-10-14 10:20:49
 * @LastEditors: zmx
 * @LastEditTime: 2022-10-20 10:29:15
 * @Description: canvas 佛学弹幕墙
-->
<template>
  <canvas ref="brrageCanvas" class="canvas"></canvas>
  <!-- <div class="test1"> <div class="content">我是123就老师开定价啥都看风景143</div> </div> -->
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    // 行数
    lineNum: {
      type: Number,
      default: 4,
    },
    // 每一行的距离
    lineSpace: {
      type: Number,
      default: 30,
    },
    // 数据
    parentList: {
      type: Array,
      default: () => [],
    },
    // 每一行速度
    customSpeed: {
      type: Array,
      default: null,
    },
    itemProps: {
      type: Object,
      default: () => {
        return {
          defaultProps: {
            fontSize: '27',
            color: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '51px',
            padding: '14-23',
            text: 'content',
          },
          specialProps: {
            color: '#9D6A0C',
            backgroundColor: '#FFF0C8',
          },
        }
      },
    },
    authorInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      list: [],
      lineMaxHeightList: Array(this.lineNum)
        .fill(null)
        .map(() => {
          return 0
        }),
      speed: Array(this.lineNum)
        .fill(0)
        .map((item, index) => {
          return { speed: (Math.random() * 1 + 2.5).toFixed(1), row: index + 1 }
        }),
      // 随机选取的背景图片数组
      imgList: [
        {
          name: '莲花',
          id: 1,
          url: 'https://image.brightfuture360.com/static/temple/randeng/box-1.png',
          dom: null,
          fontSize: 26,
          rate: 4,
        },
      ],
      canvasWidth: null,
      drawIng: false,
      authorImg: null,
      stamp: null,
      dpr: 1,
      rem2px: 50,
    }
  },
  created() {
    if (process.client) {
      this.lineList = Array(this.lineNum)
        .fill(null)
        .map(() => {
          return []
        })
      this.drawList = []
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.dpr = window.devicePixelRatio
      this.canvasWidth = this.$refs.brrageCanvas.getBoundingClientRect().width * this.dpr
      this.canvasHeight = this.$refs.brrageCanvas.getBoundingClientRect().height * this.dpr
      this.rem2px = +window.getComputedStyle(document.documentElement).fontSize.slice(0, -2)
      this.$refs.brrageCanvas.width = this.canvasWidth
      this.$refs.brrageCanvas.height = this.canvasHeight
      this.ctx = this.$refs.brrageCanvas.getContext('2d')
      // this.ctx.scale(this.dpr, this.dpr)
      if (this.customSpeed) {
        this.speed = this.customSpeed
      }
      this.list = this.parentList
      this.list.forEach((item) => {
        this.appendItem(item, true)
      })
    },
    getRow() {
      const nullIndex = this.lineList.findIndex((item) => {
        return item.length === 0
      })
      if (nullIndex > -1) {
        return nullIndex + 1
      } else {
        // 拿到每行最后一个元素
        const lastItemList = this.lineList.map((item) => {
          return item[item.length - 1]
        })
        // 寻找元素left + width 最小值
        const min = lastItemList.reduce((init, current) => {
          if (!init) {
            init = current
          } else if (init.left + init.canvas.width > current.left + current.canvas.width) {
            init = current
          }
          return init
        }, null)
        return min.row
      }
    },
    getSpeed(row) {
      return this.speed.find((item) => {
        return item.row === row
      }).speed
    },
    getImage() {
      return this.imgList[Math.floor(Math.random() * this.imgList.length)]
    },
    draw(time) {
      // if (!this.drawList.length) return

      this.drawIng = true
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      for (let i = 0; i < this.drawList.length; i++) {
        const item = this.drawList[i]
        if (item) {
          if (item.left < -item.canvas.width) {
            // this.drawList.splice(i, 1, null)
            this.lineList[item.row - 1].splice(0, 1)
            this.appendItem(item, false)
          } else if (this.stamp && time) {
            const delay = time - this.stamp
            item.left -= ((item.speed / 16.7) * delay).toFixed(1)
          } else {
            item.left -= item.speed
          }
          // this.$nextTick(() => {

          this.ctx.drawImage(item.canvas, item.left, item.top)
          // })
        }
      }
      this.stamp = time
      window.requestAnimationFrame(this.draw)
    },
    getTop(row) {
      let top = 0
      if (row === 1) {
        top = 0
      } else {
        for (let i = 0; i < row - 1; i++) {
          top += this.lineMaxHeightList[i]
        }
        top += (row - 1) * this.lineSpace
      }
      return top
    },
    async appendItem(item, needPush) {
      const img = {}
      if (!item.canvas) {
        let wish = item[this.itemProps.defaultProps.text] || item.wish
        const special = item.userId == this.authorInfo.userId
        if (special) {
          wish = this.authorInfo.username + '：' + wish
        }
        const canvas = await this.createCanvasImg(
          img.dom,
          img.fontSize || this.itemProps.defaultProps.fontSize,
          wish && wish.length > 19 ? wish.slice(0, 20) + '...' : wish,
          img.rate,
          special
        )
        item.canvas = canvas
      }
      const row = this.getRow()
      const speed = this.getSpeed(row)
      const top = this.getTop(row)
      item.row = row
      item.speed = speed
      // 生成canvas
      // 决定item开始滚动的x坐标
      if (!this.lineList[row - 1].length) {
        item.top = top
        item.left = this.canvasWidth
      } else {
        const last = this.lineList[row - 1].slice(-1)[0]
        item.top = top
        if (last.left + last.canvas.width < this.canvasWidth) {
          item.left = this.canvasWidth + 10
        } else {
          item.left = last.left + last.canvas.width + 10
        }
      }
      // console.log(item.left)
      // 添加的时候 更新每一行的最高的那个canvas
      if (this.lineMaxHeightList[row - 1] < item.canvas.height) {
        // if(this.lineMaxHeightList[row] !==0 ){
        //   item.top = top - (item.canvas.height - this.lineMaxHeightList[row - 1])/2
        // }
        this.lineMaxHeightList[row - 1] = item.canvas.height
      }
      this.lineList[row - 1].push(item)
      if (needPush) {
        this.drawList.push(item)
        console.log(this.drawList.length)
      }
      if (!this.drawIng) this.draw()
    },
    // 创建canvas
    async createCanvasImg(img, fontSize, wish, rate = 3, isSpeciel) {
      // const paddingW = +this.itemProps.defaultProps.padding.split('-')[1]
      const px = (this.rem2px / 100) * this.dpr
      // const paddingH = +this.itemProps.defaultProps.padding.split('-')[0]
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      fontSize = fontSize * px
      ctx.font = `${fontSize}px serif`
      const fontWidth = ctx.measureText(wish).width
      // const height = img ? img.height : paddingH * 2 * px + +fontSize
      const height = 60 * px
      const width = 38 * 2 * px + fontWidth + (isSpeciel ? 46 * 2 * px : 0)
      // 无背景图片时 背景的圆角半径
      const radio = height / 2
      const num = 0
      canvas.height = height
      canvas.width = width
      ctx.fillStyle = isSpeciel
        ? this.itemProps.specialProps.backgroundColor
        : this.itemProps.defaultProps.backgroundColor
      ctx.beginPath()
      ctx.arc(radio, radio, radio, Math.PI / 2, (3 / 2) * Math.PI)
      ctx.lineTo(isSpeciel ? radio + fontWidth + 38 * px : radio + fontWidth, 0)
      ctx.arc(isSpeciel ? radio + fontWidth + 38 * px : radio + fontWidth, radio, radio, (3 / 2) * Math.PI, Math.PI / 2)
      ctx.lineTo(radio, height)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = (isSpeciel ? this.itemProps.specialProps.color : this.itemProps.defaultProps.color) || '#000000'
      ctx.font = `${fontSize}px serif`
      if (isSpeciel) {
        let img = null
        if (!this.authorImg) {
          img = await this.clipImg(
            this.authorInfo.useravatar || 'https://static.zhimingfoxue.com/templeimg/20220411172932t6eojh.png',
            38 * px,
            38 * px,
            'cover',
            19 * px
          )
          this.authorImg = img
        } else {
          img = this.authorImg
        }
        ctx.drawImage(img, radio, Math.ceil(fontSize / 4), 38 * px, 38 * px)
        ctx.drawImage(imgV, radio + 26 * px, Math.ceil(fontSize / 4) + 25 * px, 13 * px, 13 * px)
        ctx.fillText(wish, radio + 46 * px, radio + Math.ceil(fontSize / 4))
      } else {
        ctx.fillText(wish, radio, radio + Math.ceil(fontSize / 4))
      }
      return canvas
    },
    clipImg(src, width, height, mode, radius) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        const img = new Image()
        // img.crossOrigin = ''
        img.onload = () => {
          const irate = img.width / img.height
          const rate = width / height
          if (radius && Math.min(width, height) / 2 >= radius) {
            ctx.beginPath()
            ctx.moveTo(0, radius)
            ctx.arc(radius, radius, radius, -Math.PI, -Math.PI / 2)
            ctx.lineTo(width - radius, 0)
            ctx.arc(width - radius, radius, radius, -Math.PI / 2, 0)
            ctx.lineTo(width, height - radius)
            ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2)
            ctx.lineTo(radius, height)
            ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)
            ctx.lineTo(0, radius)
            ctx.clip()
          }
          if (mode === 'cover') {
            if (irate > rate) {
              ctx.drawImage(
                img,
                (img.width - rate * img.height) / 2,
                0,
                rate * img.height,
                img.height,
                0,
                0,
                width,
                height
              )
            } else {
              ctx.drawImage(
                img,
                0,
                (img.height - img.width / rate) / 2,
                img.width,
                img.width / rate,
                0,
                0,
                width,
                height
              )
            }
          }
          resolve(canvas)
        }
        img.src = src
      })
    },
  },
}
</script>

<style lang="scss" scopd>
.canvas {
  width: 7.5rem;
  height: 10rem;
}
.box-0 {
  display: flex;
  justify-content: flex-start;
  .content {
    text-align: center;
    height: 72px;
    line-height: 72px;
    background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat center top/300% 72px;
    white-space: nowrap;
  }
  &::before {
    display: block;
    overflow: hidden;
    content: '';
    width: 100px;
    height: 72px;
    background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat left top/375px 72px;
  }
  &::after {
    display: block;
    overflow: hidden;
    content: '';
    width: 100px;
    height: 72px;
    background: url(https://image.brightfuture360.com/static/temple/randeng/box-1.png) no-repeat right top/375px 72px;
  }
}
</style>
