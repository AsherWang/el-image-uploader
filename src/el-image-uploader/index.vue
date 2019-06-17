<template>
    <el-upload
        drag
        action='nouse'
        :show-file-list="false"
        :before-upload="checkPicFile"
        :http-request="uploadPic"
        :accept="acceptTypes.join(',')"
        >
        <div style="position:relative;">
          <transition name="fade">
            <div v-show="uploading" class='uploading-label'>
              uploading
            </div>
          </transition>
        </div>
        <div style="width:100%;" v-show="picUploaded">
          <div class="el-upload__text">{{prompts.change}}</div>
          <div class='preview-container' :class="previewContainerClass">
            <img :src="shownPicUrl" alt="">
          </div>
          <div
            class="el-upload__tip"
            slot="tip"
            v-html="uploadTips"></div>
        </div>
        <div style="width:100%;" v-show="!picUploaded">
          <div class="el-upload__text">{{prompts.upload}}</div>
          <i class="el-icon-upload"></i>
          <div
            class="el-upload__tip"
            slot="tip"
            v-html="uploadTips"></div>
        </div>
    </el-upload>
</template>
<script>
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'ElImageUploader',
  validator: (rule, value, callback) =>
    (value && value.errMsg ? callback(new Error(value.errMsg)) : callback()),
  mixins: [emitter],
  props: {
    value: '', // original image url
    uploadAPI: Function, // 上传图片的接口方法,返回promise,resolve(url)
    name: { // 图片文件上传名
      type: String,
      default: 'pic',
    },
    // data 调用上传图片接口的时候需要额外传入的字段及其值
    // 当然可以不传入而选择在uploadAPI的实现中传入
    data: Object,
    acceptType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg', 'bmp', 'gif'],
    },
    fileSizeRestrict: Object, // {hint,fn}
    sizeRestrict: Object, // {hint,fn}
    previewContainerClass: {
      type: String,
      default: '',
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    prompts: {
      type: Object,
      default: () => ({
        upload: '将文件拖到此处，或点击上传',
        change: '将文件拖到此处，或点击更换',
      }),
    },
    wrongTypeHint: {
      type: String,
      default: '图片格式错误',
    },
  },
  data() {
    return {
      imgUrl: this.value,
      uploading: false,
    };
  },
  computed: {
    acceptTypes() {
      return this.acceptType.map(item => `image/${item}`);
    },
    picUploaded() {
      return this.imgUrl && this.imgUrl !== '';
    },
    shownPicUrl() {
      return this.imgUrl;
    },
    uploadTips() {
      const tips = [this.acceptType.join('/')];
      if (this.fileSizeRestrict && this.fileSizeRestrict.hint) {
        tips.push(this.fileSizeRestrict.hint);
      }
      if (this.sizeRestrict && this.sizeRestrict.hint) {
        tips.push(this.sizeRestrict.hint);
      }
      return tips.join(', ');
    },
  },
  methods: {
    // type: change, blur
    // data: {
    //    value:'', // will be url of the pic uploaded if not null
    //    errMsg: '' // 不为空则有报错信息
    // }
    emitMsg(type, data) {
      if (!['change'].includes(type)) {
        return;
      }
      this.$emit('input', data);
      if (data && data.errMsg) {
        this.imgUrl = '';
      }
      if (this.validateEvent) {
        this.dispatch('ElFormItem', `el.form.${type}`, [data]);
      }
    },
    checkPicFile(file) {
      return new Promise((resolve, reject) => { // eslint-disable-line
        const extRight = this.acceptTypes.includes(file.type);
        if (!extRight) {
          this.emitMsg('change', { errMsg: this.wrongTypeHint });
          console.log('wrongTypeHint', this.wrongTypeHint);
          return reject();
        }
        if (this.fileSizeRestrict) {
          const errMsg = this.fileSizeRestrict.fn(file.size);
          if (errMsg) {
            this.emitMsg('change', { errMsg });
            return reject();
          }
        }
        const tmpImg = new Image();
        tmpImg.src = window.URL.createObjectURL(file);
        tmpImg.onload = () => {
          if (this.sizeRestrict) {
            const errMsg = this.sizeRestrict.fn({
              width: tmpImg.width,
              height: tmpImg.height,
            });
            if (errMsg) {
              this.emitMsg('change', { errMsg });
              return reject();
            }
          }
          this.emitMsg('change');
          return resolve();
        };
        tmpImg.onerror = () => {
          reject();
        };
      });
    },
    uploadPic(item) {
      const formData = new FormData();
      formData.append(this.name, item.file);

      // 附加参数
      if (this.data) {
        Object.keys(this.data).forEach((key) => {
          if (this.data[key] !== Function) {
            formData.append(key, this.data[key]);
          }
        });
      }
      this.uploading = true;
      this.uploadAPI(formData)
        .then((url) => {
          this.imgUrl = url;
          this.emitMsg('change', url);
          this.uploading = false;
        })
        .catch(() => {
          this.uploading = false;
        });
    },
  },
};
</script>
<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .el-upload__tip {
    margin-top:0;
  }
  .el-icon-upload {
    margin: 25px auto;
  }
  .preview-container {
    height:100px;
    display: flex;
    align-items: center;
  }
  .preview-container img{
    max-width:100px;
    max-height:100px;
    margin:10px auto;
  }
  .uploading-label {
    position: absolute;
    top: 0;
    left: 10px;
  }
</style>
