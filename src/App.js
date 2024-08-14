document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id:1, name: 'Finca milan', img: '1.jpg', price: 500000},
            { id:2, name: 'Flores Manggarai', img: '2.jpg', price: 300000},
            { id:3, name: 'Guatemala', img: '3.jpg', price: 600000},
            { id:4, name: 'Leduk Pasuruan', img: '4.jpg', price: 800000},
            { id:5, name: 'Batahan Mandeiling', img: '5.jpg', price: 700000},
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity:0,
        add(newItem)
        {
            //Cek apakah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada barang / kosong
            if (!cartItem){
                this.items.push({...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            }else{
                //jika barang sudah ada, cek apakah barang beda atau sama
                this.items = this.items.map((item) => {
                    //jika barang beda
                    if (item.id !== newItem.id){
                        return item;
                    }else{
                        //jika barang sudah ada, tambah quantity dan totalmya
                        item.quantity++;
                        item.total = item.price * item.quantity
                        this.quantity++;
                        this.total += item.price;
                        return item
                    }
                })
            }
        },
        remove(id){
            // remove item berdasarkan id
            const cartItem = this.items.find((item) => item.id === id);

            // jika item lebih dari 1
            if (cartItem.quantity > 1) {
                // telusuri 1 1
                this.items = this.items.map((item) => {
                    //jika bukan barang yang diklik
                    if (item.id !== id){
                        return item;
                    }else{
                        item.quantity--;
                        item.total = item.price * item.quantity
                        this.quantity--;
                        this.total -= item.price
                        return item;
                    }
                });
            }else if (cartItem.quantity === 1) {
                // jika barang sisa 1
                this.items = this.items.filter((item) => item.id !== id)
                this.quantity--;
                this.total -= cartItem.price
            }
        },
    });
});


// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function(){
    for (let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0){
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        }else{
            return false;
        }    
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
    
});

// kirim data ketika button checkout di klik
checkoutButton.addEventListener('click', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    //const message = formatMessage(objData);
    //window.open('http://wa.me/6285155065596?text=' + encodeURIComponent(message))

    // minta transaksi token menggunakan ajax / fetch
    try{
        const response = await fetch('php/placeOrder.php', {
            method: 'POST',
            body: data,
        })
        const token = await response.text()
        window.snap.pay(token);
    }catch(err){
        console.log(err.message)
    }


})

// kirim pesan lewat whastapp
const formatMessage = (obj) => {
    return `Data Customer
        Nama: ${obj.name}
        Email: ${obj.email}
        No Hp: ${obj.phone}
    Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
    TOTAL: ${rupiah(obj.total)}
    Terima kasih.`
}

const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID',{
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
}