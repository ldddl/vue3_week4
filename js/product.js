console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
import pagination from './pagination.js'; // 匯入元件

let modal = '';
let delProductModal = '';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2/';
const api_path = 'ldddl';
const app = createApp({
  components:{pagination},
  data(){
    return {
      products:[],
      tempProduct:{
        imagesUrl:[], // 利用陣列存放多圖
      },
      isNew: false, // isNew，從 openModal() 改變 isNew 的值來判斷 updateProduct)() 使用編輯或新增
      pagination:{}, // 定義一個新的pagination物件，從API取得分頁用的pagination後，賦予到data的pagination
    }
  },
  methods:{
    checkLogin(){
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;
      axios.post(`${apiUrl}/api/user/check`)
        .then((result) => {
          // console.log(result);
          console.log('check_OK');
          this.getProducts();
        }).catch((err) => {
          console.dir(err)
          alert('登入驗證失敗');
          window.location.href = 'index.html';
        });
    },
    getProducts(page = 1){ //參數預設值 page = 1 ，用於分頁功能未取值時，顯示第一頁面
      axios.get(`${apiUrl}/api/${api_path}/admin/products/?page=${page}`)
        .then((result) => {
          // console.log(result);
          console.log(result.data.products);
          this.products = result.data.products;
          this.pagination = result.data.pagination; // 取得pagination
        }).catch((err) => {
          console.log('getProducts');
          console.log(err);
        });
    },
    openModal(status,product){
      // 以status區分新增及編輯按鈕
      if(status === 'isAdd'){ // 新增
        this.tempProduct = {
          imagesUrl:[],// 利用陣列存放多圖
        }
        modal.show();
        this.isNew = true;
      }else if(status === 'isEdit'){ //編輯
        console.log(product);
        // this.tempProduct = product;
        this.tempProduct = JSON.parse(JSON.stringify(product));
        modal.show();
        this.isNew = false;
      }else if(status === 'isDelete'){
        this.tempProduct = JSON.parse(JSON.stringify(product));
        delProductModal.show();
      }
    },
    deleteProduct(){
      let url = `${apiUrl}/api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
      .then((result) => {
        console.log(result);
        this.getProducts();
        delProductModal.hide();
      }).catch((err) => {

      });
    }
  },
  mounted() {
    this.checkLogin();
    modal = new bootstrap.Modal(document.querySelector('#productModal'));
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
  },
})

app.component('productModal',{
  props:['tempProduct','isNew'],
  template:`#templateForProductModal`,
  methods:{
    updateProducts(){
      let url = `${apiUrl}/api/${api_path}/admin/product`;
      let method = 'post';
      console.log(this.tempProduct);
      console.log(this.isNew);
      if(!this.isNew){
        // 編輯
        console.log(this.tempProduct.id);
        url = `${apiUrl}/api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }else{
        // 新增
        console.log(this.tempProduct);
        if(this.tempProduct.imagesUrl.length === 0){
          alert('請新增更多圖片');
          return 0;
        }
      }
      // 需根據API文件格式傳遞資料，{ data: this.tempProduct }
      console.log({ data: this.tempProduct });
      axios[method](url,{ data: this.tempProduct })
      .then((result) => {
        console.log(result);
        // this.getProducts(); // getProducts為外層方法，無法直接觸發
        this.$emit('get-products')
        modal.hide();
      }).catch((err) => {
        let errMessage = '';
        // console.log(err);
        // console.log(err.data.message);
        err.data.message.forEach( (item,i) => { errMessage += item });
        // console.log(errMessage)
        alert(errMessage);
      });
    },
  },
})

app.mount('#app');