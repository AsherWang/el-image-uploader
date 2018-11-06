#### el-image-uploader
- 与 `el-form` 和 `el-form-item` 配合使用,上传前检查图片的文件大小和宽高  
- work with `el-form` and `el-form-item`, validate image's filesize and size before uploading  

#### install  
`npm i el-image-uploader -S`  
#### usage  
```
<!-- more in folder demo -->
<el-form :model="form" :rules="rules">
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
            :uploadAPI="uploadAPI" />
    </el-form-item>
</el-form>
```
