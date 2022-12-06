const deleteProduct = (e) => {
    const productId = e.target.parentNode.querySelector('input[name=productId]').value;
    fetch(`/admin/delete-product/${productId}`, {
        method: "DELETE"
    })
    .then(res => {
        return res.json();
    })
    .then(res => {
        console.log(res);
        e.target.closest('tr').remove();
    })
    .catch(err => {
        console.log(err);
    });
}

const deleteButtons = document.querySelectorAll('.delete-product');

deleteButtons.forEach(button => {
    button.addEventListener('click', deleteProduct);
});