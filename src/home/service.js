import fetch from "../component/fetch";
export async function getEquipmentList(pageNum) {
  const pageSize = 10;
  return fetch({
    url: "/equipment/page/"+pageNum+"/"+pageSize,
    method: "get",
    // params: {
    //     pageNum,
    //     pageSize,
    // },
  });
}
export async function updateEquipment(equipment) {
  return fetch({
    url: "/equipment/update",
    method: "put",
    data: equipment,
  });
}
export async function addEquipment(equipment) {
  return fetch({
    url: "/equipment/create",
    method: "post",
    data: equipment,
  });
}
export async function deleteEquipment(id) {
    return fetch({
        url: "/equipment/"+id,
        method: "delete",
        // data:id,
    });
}
export async function uploadPhoto(file) {
    const uploadImg = new window.FormData();
    uploadImg.append('picture', file);
    const res = await fetch({
        url: "/equipment/upload",
        method: "post",
        data: uploadImg,
    });
    return JSON.parse(res).url;
  }

export async function getCategoriesList() {
    return fetch({
        url: "/category/list",
        method: "get",
    });
  }
  export async function addCategory(category) {
    return fetch({
        url: "/category/create",
        method: "post",
        data: category,
    });
  }