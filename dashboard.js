
    document.addEventListener('DOMContentLoaded', function() {
        const featureElements = document.querySelectorAll('.features-list');
        
        featureElements.forEach(function(element) {
            const dataFeatures = element.getAttribute('data-features');
            
            if (dataFeatures) {
                const features = dataFeatures.split(',');
                let featureIcons = '';
                
                features.forEach(function(feature) {
                    feature = feature.trim();
                    if (feature === 'Free Wifi') {
                        featureIcons += '<i class="fas fa-wifi"></i> Free Wifi<br>';
                    } else if (feature === 'Pet Friendly') {
                        featureIcons += '<i class="fas fa-paw"></i> Pet Friendly<br>';
                    } else if (feature === 'Swimming Pool') {
                        featureIcons += '<i class="fas fa-swimmer"></i> Swimming Pool<br>';
                    } else if (feature === 'Free Breakfast') {
                        featureIcons += '<i class="fas fa-coffee"></i> Free Breakfast<br>';
                    } else if (feature === 'Double Sized Bed') {
                        featureIcons += '<i class="fas fa-bed"></i> Double Bed<br>';
                    } else if (feature === 'Beachfront') {
                        featureIcons += '<i class="fas fa-sun"></i> Beachfront<br>';
                    } else if (feature === 'Non Beachfront') {
                        featureIcons += '<i class="fas fa-home"></i> Non Beachfront<br>';
                    } else if (feature === 'With Kitchen') {
                        featureIcons += '<i class="fas fa-utensils"></i> With Kitchen<br>';
                    } else if (feature === 'With Grilling Area') {
                        featureIcons += '<i class="fas fa-fire"></i> With Grilling Area<br>';
                    } else if (feature === 'Non Smoking') {
                        featureIcons += '<i class="fas fa-smoking-ban"></i> Non Smoking<br>';
                    } else if (['2 Pax', '3 Pax', '4 Pax', '5 Pax', '6 Pax'].includes(feature)) {
                        featureIcons += '<i class="fas fa-users"></i> Capacity: ' + feature + '<br>';
                    }
                });

                element.innerHTML = featureIcons;
            }
        });
    });
    
    

//this triggers the modal for date picker before confirming to add to cart
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const capacity = this.getAttribute('data-capacity'); // Get the room capacity

            
            const roomCapacityElement = document.getElementById('roomCapacity');
            if (roomCapacityElement) {
                roomCapacityElement.textContent = `Room Capacity: ${capacity} persons`;
            }

            // Fetch fully booked dates for the selected hotel
            fetch(`get_fully_booked_dates.php?hotel_id=${productId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const fullyBookedDates = data.fully_booked_dates;
                        initializeDatePickers(fullyBookedDates);
                    } else {
                        alert('Error fetching fully booked dates: ' + data.error);
                    }
                })
                .catch(error => console.error('Error:', error));

            // Store product ID for later use in the modal
            document.getElementById('confirmDate').setAttribute('data-product-id', productId);

            
            storePriceData(this);

            // Show the date picker modal
            const datePickerModal = new bootstrap.Modal(document.getElementById('datePickerModal'));
            datePickerModal.show();
            
        });
    });

    function storePriceData(button) {
    // Fetch pricing data from data attributes
    const price2d1nAdult = button.getAttribute('data-price-2d1n-adult');
    const price2d1nKid = button.getAttribute('data-price-2d1n-kid');
    const price3d2nAdult = button.getAttribute('data-price-3d2n-adult');
    const price3d2nKid = button.getAttribute('data-price-3d2n-kid');
    const price4d3nAdult = button.getAttribute('data-price-4d3n-adult');
    const price4d3nKid = button.getAttribute('data-price-4d3n-kid');

    // Store price data for later use in the confirm button
    const confirmDateButton = document.getElementById('confirmDate');
    confirmDateButton.setAttribute('data-price-2d1n-adult', price2d1nAdult);
    confirmDateButton.setAttribute('data-price-2d1n-kid', price2d1nKid);
    confirmDateButton.setAttribute('data-price-3d2n-adult', price3d2nAdult);
    confirmDateButton.setAttribute('data-price-3d2n-kid', price3d2nKid);
    confirmDateButton.setAttribute('data-price-4d3n-adult', price4d3nAdult);
    confirmDateButton.setAttribute('data-price-4d3n-kid', price4d3nKid);
}


    function initializeDatePickers(fullyBookedDates) {
        const checkInDateInput = document.getElementById('modalCheckInDate');
        const checkOutDateInput = document.getElementById('modalCheckOutDate');
        const numberOfNightsDisplay = document.getElementById('numberOfNights');

        checkInDateInput.setAttribute('min', getFormattedDate(new Date()));
        checkOutDateInput.setAttribute('min', getFormattedDate(new Date()));

        checkInDateInput.addEventListener('change', function () {
            const checkInDate = new Date(checkInDateInput.value);
            checkOutDateInput.setAttribute('min', getFormattedDate(checkInDate));
            checkOutDateInput.disabled = false;
            disableFullyBookedDates(fullyBookedDates);
            updateNights();
        });

        checkOutDateInput.addEventListener('change', updateNights);

        function updateNights() {
            const checkInDate = new Date(checkInDateInput.value);
            const checkOutDate = new Date(checkOutDateInput.value);
            
            if (!isNaN(checkInDate) && !isNaN(checkOutDate)) {
                const timeDiff = checkOutDate - checkInDate;
                const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                numberOfNightsDisplay.textContent = nights > 0 ? nights : 0;
                calculateTotalPrice(nights); // Update total price when nights change
            } else {
                numberOfNightsDisplay.textContent = 0;
            }
        }

        function getFormattedDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function disableFullyBookedDates(fullyBookedDates) {
            checkInDateInput.addEventListener('input', function() {
                const selectedDate = new Date(this.value);
                const dateString = getFormattedDate(selectedDate);

                if (fullyBookedDates.includes(dateString)) {
                    alert('This date is fully booked, please select another date.');
                    this.value = '';
                }
            });

            checkOutDateInput.addEventListener('input', function() {
                const selectedDate = new Date(this.value);
                const dateString = getFormattedDate(selectedDate);

                if (fullyBookedDates.includes(dateString)) {
                    alert('This date is fully booked, please select another date.');
                    this.value = '';
                }
            });
        }
    }

   function calculateTotalPrice(nights) {
    const confirmDateButton = document.getElementById('confirmDate');
    const totalPriceAdults = document.getElementById('totalPriceAdults');
    const totalPriceKids = document.getElementById('totalPriceKids');
    const pricePerHeadAdults = document.getElementById('pricePerHeadAdults');
    const pricePerHeadKids = document.getElementById('pricePerHeadKids');

    // Fetch prices from the confirmDate button and ensure they're numbers
    const price2d1nAdult = parseFloat(confirmDateButton.getAttribute('data-price-2d1n-adult')) || 0;
    const price2d1nKid = parseFloat(confirmDateButton.getAttribute('data-price-2d1n-kid')) || 0;
    const price3d2nAdult = parseFloat(confirmDateButton.getAttribute('data-price-3d2n-adult')) || 0;
    const price3d2nKid = parseFloat(confirmDateButton.getAttribute('data-price-3d2n-kid')) || 0;
    const price4d3nAdult = parseFloat(confirmDateButton.getAttribute('data-price-4d3n-adult')) || 0;
    const price4d3nKid = parseFloat(confirmDateButton.getAttribute('data-price-4d3n-kid')) || 0;

    let pricePerAdult = 0;
    let pricePerKid = 0;

    // Determine the price per head based on the number of nights
    if (nights === 1) {
        pricePerAdult = price2d1nAdult;
        pricePerKid = price2d1nKid;
    } else if (nights === 2) {
        pricePerAdult = price3d2nAdult;
        pricePerKid = price3d2nKid;
    } else if (nights >= 3) {
        pricePerAdult = price4d3nAdult;
        pricePerKid = price4d3nKid;
    }

    // Get the number of adults and kids
    const adultsCount = parseInt(document.getElementById('adultsCount').value) || 0;
    const kidsCount = parseInt(document.getElementById('kidsCount').value) || 0;

    // Update the modal with the calculated prices per head
    pricePerHeadAdults.textContent = `Price Per Adult: ₱${pricePerAdult.toFixed(2)}`;
    pricePerHeadKids.textContent = `Price Per Kid: ₱${pricePerKid.toFixed(2)}`;

    // Calculate and update the total price based on the number of guests
    totalPriceAdults.textContent = `Total Price (Adults): ₱${(pricePerAdult * adultsCount).toFixed(2)}`;
    totalPriceKids.textContent = `Total Price (Kids): ₱${(pricePerKid * kidsCount).toFixed(2)}`;

   
    const totalAmount = (pricePerAdult * adultsCount) + (pricePerKid * kidsCount);
    document.getElementById('totalAmount').textContent = `Total Amount: ₱${totalAmount.toFixed(2)}`;
}

    // Handle date confirmation
    document.getElementById('confirmDate').addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        const checkInDate = document.getElementById('modalCheckInDate').value;
        const checkOutDate = document.getElementById('modalCheckOutDate').value;

        if (!checkInDate || !checkOutDate) {
            alert('Please select both check-in and check-out dates.');
            return;
        }

        fetch(`cart.php?add_to_cart=${productId}&check_in_date=${checkInDate}&check_out_date=${checkOutDate}`)
            .then(response => response.text())
            .then(data => {
                const offcanvasCart = new bootstrap.Offcanvas(document.getElementById('offcanvasCart'));
                updateCartItems(productId);
                offcanvasCart.show();
            })
            .catch(error => console.error('Error:', error));
    });

    //Add items to the shopping cart
 function updateCartItems(productId) {
    const cartItems = document.getElementById('cartItems');
    const productElement = document.querySelector(`.add-to-cart[data-product-id="${productId}"]`);

    // Fetch check-in and check-out dates from the date picker modal
    const checkInDate = document.getElementById('modalCheckInDate').value;
    const checkOutDate = document.getElementById('modalCheckOutDate').value;

    // Fetch room, adult, and kid counts from the modal
    const roomsCount = parseInt(document.getElementById('roomsCount').value);
    const adultsCount = parseInt(document.getElementById('adultsCount').value);
    const kidsCount = parseInt(document.getElementById('kidsCount').value);

    if (!checkInDate || !checkOutDate) {
        alert("Please select both check-in and check-out dates.");
        return;
    }

    // Calculate the number of nights based on check-in and check-out dates
    const numberOfNights = calculateNights(checkInDate, checkOutDate);

    if (numberOfNights <= 0) {
        alert('Check-out date must be after check-in date.');
        return;
    }

    if (cartItems.innerHTML.includes('Your cart is empty')) {
        cartItems.innerHTML = ''; // Clear the empty cart message
    }

    if (productElement) {
        const productName = productElement.getAttribute('data-product-name');
        const productImage = productElement.getAttribute('data-product-image');
        let priceAdult, priceKid;

        // Select the correct price based on the number of nights and convert to numbers
        if (numberOfNights === 1) {
            priceAdult = parseFloat(productElement.getAttribute('data-price-2d1n-adult'));
            priceKid = parseFloat(productElement.getAttribute('data-price-2d1n-kid'));
        } else if (numberOfNights === 2) {
            priceAdult = parseFloat(productElement.getAttribute('data-price-3d2n-adult'));
            priceKid = parseFloat(productElement.getAttribute('data-price-3d2n-kid'));
        } else if (numberOfNights === 3) {
            priceAdult = parseFloat(productElement.getAttribute('data-price-4d3n-adult'));
            priceKid = parseFloat(productElement.getAttribute('data-price-4d3n-kid'));
        } else {
            alert("We only support 2D1N, 3D2N, and 4D3N stays.");
            return;
        }

        // Validate that the prices are valid numbers
        if (isNaN(priceAdult) || isNaN(priceKid)) {
            alert("Invalid price data for this product.");
            return;
        }

        // Calculate total prices for adults, kids, and rooms
        const totalPriceAdults = priceAdult * adultsCount 
        const totalPriceKids = priceKid * kidsCount 
        

        // Create a new cart item with product details and the preferred check-in/check-out dates
        const newItem = document.createElement('li');
        newItem.classList.add('list-group-item');
        newItem.setAttribute('data-category', 'hotel');
        newItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${productImage}" alt="${productName}" class="cart-item-image me-3">
                <div>
                    <p class="mb-0"><strong>${productName}</strong></p>
                    <p class="mb-0">Check-In Date: ${checkInDate}</p>
                    <p class="mb-0">Check-Out Date: ${checkOutDate}</p>
                    <p class="mb-0">Nights x ${numberOfNights}</p>
                    <p class="mb-0">Rooms x ${roomsCount}</p>
                    <p class="mb-0">Adults x ${adultsCount}</p>
                    <p class="mb-0">Kids x ${kidsCount}</p>
                    <p class="mb-0">(Adult): ₱${priceAdult.toFixed(2)}</p>
                    <p class="mb-0">(Kid): ₱${priceKid.toFixed(2)}</p>
                    <p class="mb-0">Total (Adults): ₱${totalPriceAdults.toFixed(2)}</p>
                    <p class="mb-0">Total (Kids): ₱${totalPriceKids.toFixed(2)}</p>
                     <p class="mb-0"><strong>Total Price: ₱${(totalPriceAdults + totalPriceKids).toFixed(2)}</strong></p>
                </div>
            </div>
        `;
        cartItems.appendChild(newItem);

    }
}

// Helper function to calculate the number of nights between two dates
function calculateNights(checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const numberOfNights = timeDifference / (1000 * 3600 * 24); // Convert time difference to days
    return numberOfNights;
}


    // Adjusting adults, kids, and rooms count
    document.getElementById('plusAdults').addEventListener('click', function() {
        const adultsCount = document.getElementById('adultsCount');
        adultsCount.value = parseInt(adultsCount.value) + 1;
        calculateTotalPrice(parseInt(document.getElementById('numberOfNights').textContent)); // Update total price
    });

    document.getElementById('minusAdults').addEventListener('click', function() {
        const adultsCount = document.getElementById('adultsCount');
        if (adultsCount.value > 1) {
            adultsCount.value = parseInt(adultsCount.value) - 1;
            calculateTotalPrice(parseInt(document.getElementById('numberOfNights').textContent)); // Update total price
        }
    });

    document.getElementById('plusKids').addEventListener('click', function() {
        const kidsCount = document.getElementById('kidsCount');
        kidsCount.value = parseInt(kidsCount.value) + 1;
        calculateTotalPrice(parseInt(document.getElementById('numberOfNights').textContent)); // Update total price
    });

    document.getElementById('minusKids').addEventListener('click', function() {
        const kidsCount = document.getElementById('kidsCount');
        if (kidsCount.value > 0) {
            kidsCount.value = parseInt(kidsCount.value) - 1;
            calculateTotalPrice(parseInt(document.getElementById('numberOfNights').textContent)); // Update total price
        }
    });

    document.getElementById('plusRooms').addEventListener('click', function() {
        const roomsCount = document.getElementById('roomsCount');
        roomsCount.value = parseInt(roomsCount.value) + 1;
    });

    document.getElementById('minusRooms').addEventListener('click', function() {
        const roomsCount = document.getElementById('roomsCount');
        if (roomsCount.value > 1) {
            roomsCount.value = parseInt(roomsCount.value) - 1;
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Event listener for showing the modal
    document.getElementById('addToCartModal').addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget; // Button that triggered the modal

        // Fetch ferry schedule, vessel type, and price data from the data attributes
        var ferrySchedule = button.getAttribute('data-ferry-schedule');
        var ferryVessel = button.getAttribute('data-ferry-vessel');
        var prices = JSON.parse(button.getAttribute('data-prices')); 

        // Select DOM elements for schedule, class, and price fields
        var scheduleSelect = this.querySelector('#ferrySchedule');
        var classSelect = this.querySelector('#ferryClass');
        var adultPriceField = document.getElementById('adultPrice');
        var seniorPriceField = document.getElementById('seniorPrice');
        var kidPriceField = document.getElementById('kidPrice');
        var toddlerPriceField = document.getElementById('toddlerPrice');

        // Populate the schedule select options
        scheduleSelect.innerHTML = ''; // Clear previous options
        var scheduleArray = ferrySchedule.split(','); 
        scheduleArray.forEach(function (schedule) {
            var option = document.createElement('option');
            option.text = schedule.trim();
            option.value = schedule.trim();
            scheduleSelect.add(option);
        });

        // Populate the class select options based on vessel type
        classSelect.innerHTML = ''; // Clear previous options
        if (ferryVessel === 'RORO') {
            classSelect.add(new Option('Economy Class', 'economy'));
            classSelect.add(new Option('VIP Class', 'vip'));
        } else if (ferryVessel === 'Fast Craft') {
            classSelect.add(new Option('Tourist Class', 'tourist'));
            classSelect.add(new Option('Business Class', 'business'));
        }

        // Trigger the change event to update the price fields initially
        classSelect.dispatchEvent(new Event('change'));

        // Update the prices when the class is selected
        classSelect.addEventListener('change', function () {
            var selectedClass = this.value;

            // Update the price fields based on the selected class
            if (prices[selectedClass]) {
                adultPriceField.textContent = `₱${prices[selectedClass]['adult']}`;
                seniorPriceField.textContent = `₱${prices[selectedClass]['senior']}`;
                kidPriceField.textContent = `₱${prices[selectedClass]['kid']}`;
                toddlerPriceField.textContent = `₱${prices[selectedClass]['toddler']}`;
            } else {
                // Default if no price available for the selected class
                adultPriceField.textContent = '₱0.00';
                seniorPriceField.textContent = '₱0.00';
                kidPriceField.textContent = '₱0.00';
                toddlerPriceField.textContent = '₱0.00';
            }
        });
    });

    // Handle Add to Cart button click
    document.getElementById('addToCartBtn').addEventListener('click', function () {
        const ferryDate = document.getElementById('ferryDate').value;
        const ferrySchedule = document.getElementById('ferrySchedule').value;
        const ferryClass = document.getElementById('ferryClass').value;
        const adultQty = parseInt(document.getElementById('adultQuantity').value);
        const seniorQty = parseInt(document.getElementById('seniorQuantity').value);
        const kidQty = parseInt(document.getElementById('kidQuantity').value);
        const toddlerQty = parseInt(document.getElementById('toddlerQuantity').value);


        // Prices
        const adultPrice = parseFloat(document.getElementById('adultPrice').textContent.replace('₱', ''));
        const seniorPrice = parseFloat(document.getElementById('seniorPrice').textContent.replace('₱', ''));
        const kidPrice = parseFloat(document.getElementById('kidPrice').textContent.replace('₱', ''));
        const toddlerPrice = parseFloat(document.getElementById('toddlerPrice').textContent.replace('₱', ''));

        if (ferryDate && ferrySchedule && ferryClass && adultQty >= 0 && seniorQty >= 0 && kidQty >= 0 && toddlerQty >= 0) {
            // Calculate total prices
            const totalAdultPrice = adultQty * adultPrice;
            const totalSeniorPrice = seniorQty * seniorPrice;
            const totalKidPrice = kidQty * kidPrice;
            const totalToddlerPrice = toddlerQty * toddlerPrice;
            const totalPrice = totalAdultPrice + totalSeniorPrice + totalKidPrice + totalToddlerPrice;

            // Add the item to the cart
            const cartItems = document.getElementById('cartItems');
            const newItem = document.createElement('li');
            newItem.classList.add('list-group-item');
             newItem.setAttribute('data-category', 'ferry');
            newItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <div>
                        <p class="mb-0"><strong>${ferryClass} Class</strong></p>
                        <p class="mb-0">Date: ${ferryDate}</p>
                        <p class="mb-0">Schedule: ${ferrySchedule}</p>
                        <p class="mb-0">Adults: ${adultQty} x ₱${adultPrice.toFixed(2)} = ₱${totalAdultPrice.toFixed(2)}</p>
                        <p class="mb-0">Seniors: ${seniorQty} x ₱${seniorPrice.toFixed(2)} = ₱${totalSeniorPrice.toFixed(2)}</p>
                        <p class="mb-0">Kids: ${kidQty} x ₱${kidPrice.toFixed(2)} = ₱${totalKidPrice.toFixed(2)}</p>
                        <p class="mb-0">Toddlers: ${toddlerQty} x ₱${toddlerPrice.toFixed(2)} = ₱${totalToddlerPrice.toFixed(2)}</p>
                        <p class="mb-0"><strong>Total Price: ₱${totalPrice.toFixed(2)}</strong></p>
                    </div>
                </div>
            `;

            // Append the new item to the cart
            if (cartItems.innerHTML.includes('Your cart is empty')) {
                cartItems.innerHTML = ''; // Clear empty cart message
            }
            cartItems.appendChild(newItem);

          
            clearModalInputs();

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addToCartModal'));
            modal.hide();
        } else {
            alert('Please fill out all fields and ensure quantities are valid.');
        }
    });

    // Function to clear modal inputs
    function clearModalInputs() {
        document.getElementById('ferryDate').value = '';
        document.getElementById('ferrySchedule').value = 'Select Schedule';
        document.getElementById('ferryClass').value = 'Select Class';
        document.getElementById('adultQuantity').value = '0';
        document.getElementById('seniorQuantity').value = '0';
        document.getElementById('kidQuantity').value = '0';
        document.getElementById('toddlerQuantity').value = '0';
        document.getElementById('adultPrice').textContent = '₱0.00';
        document.getElementById('seniorPrice').textContent = '₱0.00';
        document.getElementById('kidPrice').textContent = '₱0.00';
        document.getElementById('toddlerPrice').textContent = '₱0.00';
    }
});




document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners for meal quantity adjustments in modal
    document.getElementById('plusMealQuantityModal').addEventListener('click', function () {
        const input = document.getElementById('mealQuantityModal');
        input.value = parseInt(input.value) + 1;
    });

    document.getElementById('minusMealQuantityModal').addEventListener('click', function () {
        const input = document.getElementById('mealQuantityModal');
        if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
        }
    });

    // Add event listener to open modal and populate it with the meal data
    document.querySelectorAll('.add-to-cart-meal').forEach(function (button) {
        button.addEventListener('click', function () {
            const mealId = this.getAttribute('data-meal-id');
            const mealName = this.getAttribute('data-meal-name');
            const mealPrice = this.getAttribute('data-meal-price');
            const mealImage = this.getAttribute('data-meal-image');

            // Set the modal fields
            document.getElementById('mealName').textContent = mealName;
            document.getElementById('mealPrice').textContent = mealPrice;
            document.getElementById('mealImage').src = mealImage;

            // Store meal data in the confirm button
            const confirmButton = document.getElementById('confirmMealAddToCart');
            confirmButton.setAttribute('data-meal-id', mealId);
            confirmButton.setAttribute('data-meal-name', mealName);
            confirmButton.setAttribute('data-meal-price', mealPrice);
            confirmButton.setAttribute('data-meal-image', mealImage);
        });
    });

    // Add event listener for confirming and adding meal to cart
    document.getElementById('confirmMealAddToCart').addEventListener('click', function () {
        const mealId = this.getAttribute('data-meal-id');
        const mealName = this.getAttribute('data-meal-name');
        const mealPrice = parseFloat(this.getAttribute('data-meal-price'));
        const mealQuantity = parseInt(document.getElementById('mealQuantityModal').value);
        const mealImage = this.getAttribute('data-meal-image');

        // Get the cart items container
        const cartItems = document.getElementById('cartItems');

        if (cartItems.innerHTML.includes('Your cart is empty')) {
            cartItems.innerHTML = ''; // Clear the empty cart message
        }

        // Calculate the total price for the meal
        const totalMealPrice = mealPrice * mealQuantity;

        // Create a new cart item for the meal
        const newItem = document.createElement('li');
        newItem.classList.add('list-group-item');
         newItem.setAttribute('data-category', 'meal');
        newItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${mealImage}" alt="${mealName}" class="cart-item-image me-3">
                <div>
                    <p class="mb-0"><strong>${mealName}</strong></p>
                    <p class="mb-0">Quantity: ${mealQuantity}</p>
                    <p class="mb-0">Price per Meal: ₱${mealPrice.toFixed(2)}</p>
                    <p class="mb-0"><strong>Total Price: ₱${totalMealPrice.toFixed(2)}</strong></p>
                </div>
            </div>
        `;

        // Add the new item to the cart
        cartItems.appendChild(newItem);

        // Close the modal after adding to the cart
        const mealModal = bootstrap.Modal.getInstance(document.getElementById('mealModal'));
        mealModal.hide();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Event listener for "Add to Cart" buttons
    document.querySelectorAll('.addToCartBtn').forEach(function (button) {
        button.addEventListener('click', function () {
            // Get tour details from the button's data attributes
            const tourId = this.getAttribute('data-tour-id');
            const tourName = this.getAttribute('data-tour-name');
            const priceAdult = this.getAttribute('data-price-adult');
            const priceKid = this.getAttribute('data-price-kid');

            // Populate the modal with the tour details
            document.getElementById('tourName' + tourId).textContent = tourName;
            document.getElementById('adultPrice' + tourId).textContent = priceAdult;
            document.getElementById('kidPrice' + tourId).textContent = priceKid;

            // Reset the quantity fields
            document.getElementById('adultsCount' + tourId).value = 1;
            document.getElementById('kidsCount' + tourId).value = 0;
        });
    });

    // Event listener for quantity adjustments (plus buttons)
    document.querySelectorAll('.plus').forEach(function (plusBtn) {
        plusBtn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        });
    });

    // Event listener for quantity adjustments (minus buttons)
    document.querySelectorAll('.minus').forEach(function (minusBtn) {
        minusBtn.addEventListener('click', function () {
            const input = this.nextElementSibling;
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });

    // Event listener for "Confirm Add to Cart" buttons
    document.querySelectorAll('.confirmAddToCart').forEach(function (button) {
        button.addEventListener('click', function () {
            const tourId = this.getAttribute('data-tour-id');
            const tourName = document.getElementById('tourName' + tourId).textContent;
            const priceAdult = document.getElementById('adultPrice' + tourId).textContent;
            const priceKid = document.getElementById('kidPrice' + tourId).textContent;
            const adultsCount = document.getElementById('adultsCount' + tourId).value;
            const kidsCount = document.getElementById('kidsCount' + tourId).value;

            // Calculate the total price
            const totalPriceAdults = (parseFloat(priceAdult) * parseInt(adultsCount)).toFixed(2);
            const totalPriceKids = (parseFloat(priceKid) * parseInt(kidsCount)).toFixed(2);

            // Update the cart with the new item
            updateCart(tourName, adultsCount, kidsCount, totalPriceAdults, totalPriceKids);

            // Close the modal after adding to cart
            const modal = document.querySelector(`#addToCartModal${tourId}`);
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        });
    });

    // Function to update the cart
    function updateCart(tourName, adultsCount, kidsCount, totalPriceAdults, totalPriceKids) {
        const cartItems = document.getElementById('cartItems');

        // Check if cart is empty and remove the empty message
        if (cartItems.innerHTML.includes('Your cart is empty')) {
            cartItems.innerHTML = ''; // Clear empty cart message
        }

        // Create a new cart item element
        const newItem = document.createElement('li');
        newItem.classList.add('list-group-item');
        newItem.setAttribute('data-category', 'tour');
        newItem.innerHTML = `
            <div class="d-flex align-items-center">
                <div>
                    <p class="mb-0"><strong>Tour: ${tourName}</strong></p>
                    <p class="mb-0">Adults: ${adultsCount} x ₱${totalPriceAdults}</p>
                    <p class="mb-0">Kids: ${kidsCount} x ₱${totalPriceKids}</p>
                    <p class="mb-0"><strong>Total Price: ₱${(parseFloat(totalPriceAdults) + parseFloat(totalPriceKids)).toFixed(2)}</strong></p>
                </div>
            </div>
        `;

        // Append the new item to the cart
        cartItems.appendChild(newItem);
    }
});


document.addEventListener('DOMContentLoaded', function () {
    let overallTotalBill = 0;

    // Function to update the total bill in the UI
    function updateTotalBill(amount) {
        overallTotalBill += amount;
        document.getElementById('totalBill').textContent = overallTotalBill.toFixed(2);
    }

    // Function to update cart items based on the category
    function updateCartItems(category, productId) {
        const cartItems = document.getElementById('cartItems');
        let totalItemPrice = 0; // To track the total price of each item

        if (category === 'hotel') {
            const productElement = document.querySelector(`.add-to-cart[data-product-id="${productId}"]`);
            const checkInDate = document.getElementById('modalCheckInDate').value;
            const checkOutDate = document.getElementById('modalCheckOutDate').value;
            const roomsCount = parseInt(document.getElementById('roomsCount').value);
            const adultsCount = parseInt(document.getElementById('adultsCount').value);
            const kidsCount = parseInt(document.getElementById('kidsCount').value);

            const numberOfNights = calculateNights(checkInDate, checkOutDate);
            if (!checkInDate || !checkOutDate || numberOfNights <= 0) {
                alert("Please select valid check-in and check-out dates.");
                return;
            }

            let priceAdult, priceKid;
            if (numberOfNights === 1) {
                priceAdult = parseFloat(productElement.getAttribute('data-price-2d1n-adult'));
                priceKid = parseFloat(productElement.getAttribute('data-price-2d1n-kid'));
            } else if (numberOfNights === 2) {
                priceAdult = parseFloat(productElement.getAttribute('data-price-3d2n-adult'));
                priceKid = parseFloat(productElement.getAttribute('data-price-3d2n-kid'));
            } else {
                priceAdult = parseFloat(productElement.getAttribute('data-price-4d3n-adult'));
                priceKid = parseFloat(productElement.getAttribute('data-price-4d3n-kid'));
            }

            const totalPriceAdults = priceAdult * adultsCount;
            const totalPriceKids = priceKid * kidsCount;
            totalItemPrice = totalPriceAdults + totalPriceKids; // Calculate the total for this hotel item

            const newItem = `
                <li class="list-group-item">
                    <div class="d-flex align-items-center">
                        <img src="${productElement.getAttribute('data-product-image')}" alt="${productElement.getAttribute('data-product-name')}" class="cart-item-image me-3">
                        <div>
                            <p><strong>${productElement.getAttribute('data-product-name')}</strong></p>
                            <p>Check-In Date: ${checkInDate}</p>
                            <p>Check-Out Date: ${checkOutDate}</p>
                            <p>Nights: ${numberOfNights}</p>
                            <p>Rooms: ${roomsCount}</p>
                            <p>Adults: ${adultsCount}</p>
                            <p>Kids: ${kidsCount}</p>
                            <p>Total Price (Adults): ₱${totalPriceAdults.toFixed(2)}</p>
                            <p>Total Price (Kids): ₱${totalPriceKids.toFixed(2)}</p>
                            <p><strong>Total: ₱${totalItemPrice.toFixed(2)}</strong></p>
                        </div>
                    </div>
                </li>
            `;
            cartItems.innerHTML += newItem;
            updateTotalBill(totalItemPrice);

        } else if (category === 'ferry') {
            const ferryDate = document.getElementById('ferryDate').value;
            const ferrySchedule = document.getElementById('ferrySchedule').value;
            const ferryClass = document.getElementById('ferryClass').value;
            const adultQty = parseInt(document.getElementById('adultQuantity').value);
            const seniorQty = parseInt(document.getElementById('seniorQuantity').value);
            const kidQty = parseInt(document.getElementById('kidQuantity').value);
            const toddlerQty = parseInt(document.getElementById('toddlerQuantity').value);

            const adultPrice = parseFloat(document.getElementById('adultPrice').textContent.replace('₱', ''));
            const seniorPrice = parseFloat(document.getElementById('seniorPrice').textContent.replace('₱', ''));
            const kidPrice = parseFloat(document.getElementById('kidPrice').textContent.replace('₱', ''));
            const toddlerPrice = parseFloat(document.getElementById('toddlerPrice').textContent.replace('₱', ''));

            totalItemPrice = (adultQty * adultPrice) + (seniorQty * seniorPrice) + (kidQty * kidPrice) + (toddlerQty * toddlerPrice);

            const newItem = `
                <li class="list-group-item">
                    <div class="d-flex align-items-center">
                        <div>
                            <p><strong>${ferryClass} Class</strong></p>
                            <p>Date: ${ferryDate}</p>
                            <p>Schedule: ${ferrySchedule}</p>
                            <p>Adults: ${adultQty} x ₱${adultPrice.toFixed(2)} = ₱${(adultQty * adultPrice).toFixed(2)}</p>
                            <p>Seniors: ${seniorQty} x ₱${seniorPrice.toFixed(2)} = ₱${(seniorQty * seniorPrice).toFixed(2)}</p>
                            <p>Kids: ${kidQty} x ₱${kidPrice.toFixed(2)} = ₱${(kidQty * kidPrice).toFixed(2)}</p>
                            <p>Toddlers: ${toddlerQty} x ₱${toddlerPrice.toFixed(2)} = ₱${(toddlerQty * toddlerPrice).toFixed(2)}</p>
                            <p><strong>Total Price: ₱${totalItemPrice.toFixed(2)}</strong></p>
                        </div>
                    </div>
                </li>
            `;
            cartItems.innerHTML += newItem;
            updateTotalBill(totalItemPrice);

        } else if (category === 'meal') {
            const productElement = document.querySelector(`.add-to-cart[data-product-id="${productId}"]`);
            const mealQuantity = parseInt(document.getElementById('mealQuantityModal').value);
            const mealPrice = parseFloat(productElement.getAttribute('data-meal-price'));
            const mealImage = productElement.getAttribute('data-meal-image');

            totalItemPrice = mealPrice * mealQuantity;

            const newItem = `
                <li class="list-group-item">
                    <div class="d-flex align-items-center">
                        <img src="${mealImage}" alt="${productElement.getAttribute('data-meal-name')}" class="cart-item-image me-3">
                        <div>
                            <p><strong>${productElement.getAttribute('data-meal-name')}</strong></p>
                            <p>Quantity: ${mealQuantity}</p>
                            <p>Price per Meal: ₱${mealPrice.toFixed(2)}</p>
                            <p><strong>Total Price: ₱${totalItemPrice.toFixed(2)}</strong></p>
                        </div>
                    </div>
                </li>
            `;
            cartItems.innerHTML += newItem;
            updateTotalBill(totalItemPrice);

        } else if (category === 'tour') {
            const productElement = document.querySelector(`.add-to-cart[data-product-id="${productId}"]`);
            const tourName = productElement.getAttribute('data-tour-name');
            const adultsCount = parseInt(document.getElementById('adultsCount').value);
            const kidsCount = parseInt(document.getElementById('kidsCount').value);
            const adultPrice = parseFloat(document.getElementById('adultPrice').textContent.replace('₱', ''));
            const kidPrice = parseFloat(document.getElementById('kidPrice').textContent.replace('₱', ''));

            const totalPriceAdults = adultsCount * adultPrice;
            const totalPriceKids = kidsCount * kidPrice;
            totalItemPrice = totalPriceAdults + totalPriceKids;

            const newItem = `
                <li class="list-group-item">
                    <div class="d-flex align-items-center">
                        <div>
                            <p><strong>${tourName}</strong></p>
                            <p>Adults: ${adultsCount} x ₱${adultPrice.toFixed(2)} = ₱${totalPriceAdults.toFixed(2)}</p>
                            <p>Kids: ${kidsCount} x ₱${kidPrice.toFixed(2)} = ₱${totalPriceKids.toFixed(2)}</p>
                            <p><strong>Total Price: ₱${totalItemPrice.toFixed(2)}</strong></p>
                        </div>
                    </div>
                </li>
            `;
            cartItems.innerHTML += newItem;
            updateTotalBill(totalItemPrice);
        }
    }

    // Attach event listeners for different categories
    document.getElementById('addToCartBtn').addEventListener('click', function () {
        updateCartItems('hotel', this.getAttribute('data-product-id'));
    });

    document.getElementById('confirmMealAddToCart').addEventListener('click', function () {
        updateCartItems('meal', this.getAttribute('data-meal-id'));
    });

    // For ferry and tour, attach similar event listeners
    document.getElementById('confirmFerryAddToCart').addEventListener('click', function () {
        updateCartItems('ferry', this.getAttribute('data-ferry-id'));
    });

    document.getElementById('confirmTourAddToCart').addEventListener('click', function () {
        updateCartItems('tour', this.getAttribute('data-tour-id'));
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const proceedToCheckoutButton = document.getElementById('proceedToCheckout');
    
    if (proceedToCheckoutButton) {
        proceedToCheckoutButton.addEventListener('click', function () {
            const cartItems = document.querySelectorAll('#cartItems .list-group-item');
            let cartSummary = [];
            let totalAmount = 0; // Initialize the total order amount to accumulate prices
            
            cartItems.forEach(function (item) {
                let itemDetails = {};
                const category = item.getAttribute('data-category');
                
                itemDetails.productName = item.querySelector('strong').textContent;

                // Extract details based on category and update `totalAmount`
                if (category === 'hotel') {
                    itemDetails.checkInDate = item.querySelector('.mb-0:nth-child(2)').textContent;
                    itemDetails.checkOutDate = item.querySelector('.mb-0:nth-child(3)').textContent;
                    itemDetails.nights = item.querySelector('.mb-0:nth-child(4)').textContent;
                    itemDetails.rooms = item.querySelector('.mb-0:nth-child(5)').textContent;
                    itemDetails.adults = item.querySelector('.mb-0:nth-child(6)').textContent;
                    itemDetails.kids = item.querySelector('.mb-0:nth-child(7)').textContent;
                    
                    // Parse the total price safely
                    const totalPriceText = item.querySelector('strong:last-child').textContent.replace('₱', '').replace(',', '');
                    const totalItemPrice = parseFloat(totalPriceText) || 0; 
                    itemDetails.totalPrice = totalItemPrice;
                    totalAmount += totalItemPrice; // Add item total to overall total
                } else if (category === 'ferry') {
                    itemDetails.date = item.querySelector('.mb-0:nth-child(2)').textContent;
                    itemDetails.schedule = item.querySelector('.mb-0:nth-child(3)').textContent;
                    itemDetails.adults = item.querySelector('.mb-0:nth-child(4)').textContent;
                    itemDetails.seniors = item.querySelector('.mb-0:nth-child(5)').textContent;
                    itemDetails.kids = item.querySelector('.mb-0:nth-child(6)').textContent;

                    const totalPriceText = item.querySelector('strong:last-child').textContent.replace('₱', '').replace(',', '');
                    const totalItemPrice = parseFloat(totalPriceText) || 0;
                    itemDetails.totalPrice = totalItemPrice;
                    totalAmount += totalItemPrice; // Add item total to overall total
                } else if (category === 'meal') {
                    itemDetails.quantity = item.querySelector('.mb-0:nth-child(2)').textContent;
                    
                    const totalPriceText = item.querySelector('strong:last-child').textContent.replace('₱', '').replace(',', '');
                    const totalItemPrice = parseFloat(totalPriceText) || 0;
                    itemDetails.totalPrice = totalItemPrice;
                    totalAmount += totalItemPrice; // Add item total to overall total
                } else if (category === 'tour') {
                    itemDetails.adults = item.querySelector('.mb-0:nth-child(2)').textContent;
                    itemDetails.kids = item.querySelector('.mb-0:nth-child(3)').textContent;

                    const totalPriceText = item.querySelector('strong:last-child').textContent.replace('₱', '').replace(',', '');
                    const totalItemPrice = parseFloat(totalPriceText) || 0;
                    itemDetails.totalPrice = totalItemPrice;
                    totalAmount += totalItemPrice; // Add item total to overall total
                }

                // Add item details to cart summary
                cartSummary.push(itemDetails);
            });

            // Display the cart summary and the total amount in the modal
            displayCartSummary(cartSummary, totalAmount);
        });
    }

    function displayCartSummary(cartSummary, totalAmount) {
        const summaryModal = document.getElementById('summaryModalContent');
        const totalPriceElement = document.getElementById('totalPriceSummary'); 
        summaryModal.innerHTML = ''; // Clear previous content

        cartSummary.forEach(function (item) {
            let summaryItem = `
                <div>
                    <p><strong>Product:</strong> ${item.productName}</p>
            `;

            if (item.checkInDate) {
                summaryItem += `<p><strong>Check-In:</strong> ${item.checkInDate}</p>`;
                summaryItem += `<p><strong>Check-Out:</strong> ${item.checkOutDate}</p>`;
                summaryItem += `<p><strong>Nights:</strong> ${item.nights}</p>`;
                summaryItem += `<p><strong>Rooms:</strong> ${item.rooms}</p>`;
                summaryItem += `<p><strong>Adults:</strong> ${item.adults}</p>`;
                summaryItem += `<p><strong>Kids:</strong> ${item.kids}</p>`;
            } else if (item.date) {
                summaryItem += `<p><strong>Date:</strong> ${item.date}</p>`;
                summaryItem += `<p><strong>Schedule:</strong> ${item.schedule}</p>`;
                summaryItem += `<p><strong>Adults:</strong> ${item.adults}</p>`;
                summaryItem += `<p><strong>Seniors:</strong> ${item.seniors}</p>`;
                summaryItem += `<p><strong>Kids:</strong> ${item.kids}</p>`;
            } else if (item.quantity) {
                summaryItem += `<p><strong>Quantity:</strong> ${item.quantity}</p>`;
            } else if (item.adults) {
                summaryItem += `<p><strong>Adults:</strong> ${item.adults}</p>`;
                summaryItem += `<p><strong>Kids:</strong> ${item.kids}</p>`;
            }

            summaryItem += `<p><strong>Total Price:</strong> ₱${item.totalPrice.toFixed(2)}</p>`;
            summaryItem += `<hr></div>`;
            summaryModal.innerHTML += summaryItem;
        });

        // Update the total price in the footer
        totalPriceElement.innerHTML = `<strong>Total Amount: ₱${totalAmount.toFixed(2)}</strong>`;

        // Show the modal
        const checkoutModal = new bootstrap.Modal(document.getElementById('summaryModal'));
        checkoutModal.show();
    }
});
document.getElementById('confirmBookingBtn').addEventListener('click', function () {
    const contactNumber = document.getElementById('contactNumber').value;
    const totalAmount = document.getElementById('totalPriceSummary').innerText.replace('Total Amount: ₱', '');
    
    // Prepare the data to send
    const bookingData = {
        username: "<?php echo htmlspecialchars($user['username']); ?>",
        email: "<?php echo htmlspecialchars($user['email']); ?>",
        contactNumber: contactNumber,
        totalAmount: totalAmount,
        
    };

    // Send data to server via AJAX
    fetch('confirmBooking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Booking confirmed!');
            // Optionally close the modal
            $('#summaryModal').modal('hide');
        } else {
            // Handle error case
            alert('Error confirming booking: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
