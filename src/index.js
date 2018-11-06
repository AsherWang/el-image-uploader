import ElImageUploader from './el-image-uploader/index.vue';

ElImageUploader.install = (Vue) => {
  Vue.component(ElImageUploader.name, ElImageUploader);
};

export default ElImageUploader;
