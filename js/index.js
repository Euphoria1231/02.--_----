/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
const creator = "HHH";
function getBooksList() {
    axios({
        url: "https://hmajax.itheima.net/api/books",
        params: {
            creator,
        },
    }).then((result) => {
        const bookList = result.data.data;
        const htmlStr = bookList
            .map((item, index) => {
                return `<tr>
          <td>${index + 1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td data-id=${item.id}>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>`;
            })
            .join("");
        document.querySelector(".list").innerHTML = htmlStr;
    });
}
getBooksList();

const addBtn = document.querySelector(".add-btn");
const addModal = document.querySelector(".add-modal");
const addmodal = new bootstrap.Modal(addModal);
addBtn.addEventListener("click", function () {
    const addForm = document.querySelector(".add-form");
    const inputElems = serialize(addForm, { hash: true, empty: true });
    let bookname = inputElems.bookname;
    let author = inputElems.author;
    let publisher = inputElems.publisher;
    axios({
        url: "https://hmajax.itheima.net/api/books",
        method: "post",
        data: {
            bookname,
            author,
            publisher,
            creator,
        },
    }).then(() => getBooksList());
    addmodal.hide();
    bookname = "";
    author = "";
    publisher = "";
});

const list = document.querySelector(".list");
list.addEventListener("click", function (e) {
    if (e.target.classList.contains("del")) {
        const id = e.target.parentNode.dataset.id;
        console.log(id);
        axios({
            url: `https://hmajax.itheima.net/api/books/${id}`,
            method: "DELETE",
        }).then(() => {
            getBooksList();
        });
    }
});

/**
 * 折戟于添加删除功能，问题很多，下面总结一下
 * 首先是渲染页面的处理，我太脑瘫了，竟然想着把每一个 td 单独列出来写，再合并给 tr
 * 其实根本不用这么麻烦，真正的屎山代码
 * 把 tr 和 td 直接当作一个模板字符串传递就可以了
 * 第二个方面是自定义属性的添加
 * 不熟练，记不起来用，用也用错
 * 要记住了，如果有什么值不需要在页面上展示，但是还是需要使用
 * 就把它放在一个自定义属性中
 */

const editModal = document.querySelector(".edit-modal");
const editmodal = new bootstrap.Modal(editModal);
let id;
list.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit")) {
        id = e.target.parentNode.dataset.id;
        editmodal.show();
    }
});
const editBtn = document.querySelector(".edit-btn");
editBtn.addEventListener("click", function () {
    const editForm = document.querySelector(".edit-form");
    const inputElems = serialize(editForm, { hash: true, empty: true });
    let bookname = inputElems.bookname;
    let author = inputElems.author;
    let publisher = inputElems.publisher;
    axios({
        url: `https://hmajax.itheima.net/api/books/${id}`,
        method: "PUT",
        data: {
            bookname,
            author,
            publisher,
            creator,
        },
    }).then(() => {
        getBooksList();
    });
    editmodal.hide();
});
