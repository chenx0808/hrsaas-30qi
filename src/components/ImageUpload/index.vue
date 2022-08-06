<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list.sync="fileList"
      :class="{fileComputed:isCompleted}"
      :limit="1"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width:200px" :percentage="percentage" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// 初始化一个cos实例
const cos = new COS({
  SecretId: 'AKIDWr35sQo10lIbhX9XjhSzJRL1Yr1xfAWe',
  SecretKey: 'xfARXR9g19II3athGbiaDcnjQ0LSedR3'
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      showPercent: false,
      dialogImageUrl: '',
      dialogVisible: false,
      // 指定默认的图片
      fileList: [
        {
          url: 'https://n.sinaimg.cn/sinakd20121/560/w1080h1080/20200525/0ceb-itzixrt2759506.jpg'
        }
      ],
      percentage: 0 // 进度条
    }
  },
  // 判断是否有图片
  computed: {
    isCompleted() {
      return this.fileList.length === 1
    }
  },
  methods: {
    changeFile(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
      // console.log(this.fileList)
      // this.fileList = fileList
    },
    // 当前点击图片的文件对象
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('照片类型不匹配')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件太大了')
        return false
      }
      // 上传过程把进度条打开
      this.showPercent = true
    },
    upload({ file }) {
      // console.log(file)
      cos.putObject({
        Bucket: 'chen-1313213583', // 存储桶
        Region: 'ap-beijing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          this.percentage = percent * 100
        }
      }, (err, data) => {
        if (err) {
          return this.$message.error('上传失败')
        }
        this.fileList.forEach((item) => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            // 只有成功获取到了服务器图片链接的时候 加一个标识
            // 目的：提交更新的时候 进行判断 如果当前文件对象里面没有upload属性  不进行提交
            item.upload = true
          }
        })
        // 上传成功把进度条关闭
        setTimeout(() => {
          this.showPercent = false
          this.percentage = 0
        }, 2000)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.fileComputed{
  ::v-deep .el-upload--picture-card{
    display: none;
  }
}
</style>
