export default {
  // 將外部元件資料用props傳入
  props:['pages'],
  template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a class="page-link" href="#" aria-label="Previous"
        @click="$emit('get-product',pages.current_page-1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      
      <li class="page-item" v-for="page in pages.total_pages" 
      :class="{ active: page === pages.current_page }"
      :key="page_+'123'">
      <a class="page-link" href="#"
      @click="$emit('get-product',page)">{{ page }}
      </a>
      </li>

      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a class="page-link" href="#" aria-label="Next"
        @click="$emit('get-product',pages.current_page+1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`
}
// :key="page_+'123'"，避免重複，加上字串123；將{{ page }}帶入畫面，有page時就顯示
// :class="{ disabled: !pages.has_pre }"，要是無前一頁，就disabled 按鈕"<<"
// :class="{ disabled: !pages.has_next }"，要是無後一頁，就disabled 按鈕">>"
// :class="{ active: page === pages.current_page }" ，當前頁面加上樣式效果
// @click="$emit('get-product',page)" ，v-on綁定click事件，利用$emit將內層元件及資料傳到外層