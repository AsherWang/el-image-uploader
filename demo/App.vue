<template>
  <div id="app">
    <div class='container'>
      <div class='title'>el-image-uploader</div>
      <el-form label-position="left" ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item prop="img1" label="img1">
          <el-image-uploader
            v-model="form.img1"
            :fileSizeRestrict="fileSizeRestrict"
            :sizeRestrict="sizeRestrict"
            :uploadAPI="uploadAPI" />
        </el-form-item>
        <el-form-item prop="img2" label="img2">
          <el-image-uploader
            v-model="form.img2"
            :sizeRestrict="sizeRestrict"
            :acceptType="['png', 'jpg', 'jpeg']"
            :uploadAPI="uploadAPI" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ElImageUploader from '../src';

export default {
  name: 'app',
  components: {
    ElImageUploader,
  },
  data() {
    return {
      form: {
        img1: '',
        img2: 'https://via.placeholder.com/200x150',
      },
      rules: {
        img1: [
          { validator: ElImageUploader.validator, trigger: 'change' },
        ],
        img2: [
          { validator: ElImageUploader.validator, trigger: 'change' },
        ],
      },
      fileSizeRestrict: {
        hint: '不要大于30M',
        fn(size) {
          if (size > 1024 * 1024 * 30) {
            return '不可以大于30M';
          }
          return '';
        },
      },
      sizeRestrict: {
        hint: '尺寸限制在400x500',
        fn(size) {
          if (size.width > 400) {
            return '宽度不可以大于400';
          }
          if (size.height > 500) {
            return '高度不可以大于500';
          }
          return '';
        },
      },
    };
  },
  methods: {
    uploadAPI(data) {
      // replace with real upload method and resolve it with url after image is uploaded
      console.log('data in request', data);
      return Promise.resolve('https://via.placeholder.com/300x150');
    },
  },
};
</script>
<style>
  html,body {
    min-width: 500px;
  }
  .container {
    max-width: 500px;
    margin: 0 auto;
  }
  .container .title {
    margin: 20px auto;
    font-weight: bold;
    text-align: center;
  }
</style>
