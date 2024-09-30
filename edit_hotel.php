
<?
$(function() {
    $('#edit_fully_booked_dates').datepicker({
        dateFormat: 'yy-mm-dd',
        beforeShowDay: function(date) {
            const string = jQuery.datepicker.formatDate('yy-mm-dd', date);
            return [!$('#edit_fully_booked_dates').val().split(',').includes(string)];
        },
        onSelect: function(dateText) {
            let currentDates = $('#edit_fully_booked_dates').val().split(',');
            if (!currentDates.includes(dateText)) {
                currentDates.push(dateText);
            } else {
                currentDates = currentDates.filter(date => date !== dateText); 
            }
            $('#edit_fully_booked_dates').val(currentDates.join(',')); 
        }

    window.openEditModal = function(hotel) {
        $('#edit_hotel_id').val(hotel.id);
        $('#edit_hotel_name').val(hotel.name);
        $('#edit_price_adult').val(hotel.price_adult);
        $('#edit_price_kid').val(hotel.price_kid);
        $('#edit_check_in').val(hotel.check_in);
        $('#edit_check_out').val(hotel.check_out);
        $('#edit_capacity').val(hotel.capacity);
        $('#edit_description').val(hotel.description);
        $('#edit_image_url').val(hotel.image_url);
        $('#edit_inclusions').val(hotel.inclusions);
        $('#edit_exclusions').val(hotel.exclusions);
        $('#edit_policy').val(hotel.policy);
        $('#edit_fully_booked_dates').val(hotel.fully_booked_dates);


        $('#edit_feature_wifi').prop('checked', hotel.features.includes('Free Wifi'));
        $('#edit_feature_breakfast').prop('checked', hotel.features.includes('Free Breakfast'));
        $('#edit_feature_pool').prop('checked', hotel.features.includes('Swimming Pool'));
        $('#edit_feature_pet').prop('checked', hotel.features.includes('Pet Friendly'));
        $('#edit_feature_non_beachfront').prop('checked', hotel.features.includes('Non Beachfront'));
        $('#edit_feature_beachfront').prop('checked', hotel.features.includes('Beachfront'));
        $('#edit_feature_kitchen').prop('checked', hotel.features.includes('With Kitchen'));
        $('#edit_feature_grilling_area').prop('checked', hotel.features.includes('With Grilling Area'));
        $('#edit_feature_non_smoking').prop('checked', hotel.features.includes('Non Smoking'));
        $('#edit_feature_double_bed').prop('checked', hotel.features.includes('Double Sized Bed'));


        var editHotelModal = new bootstrap.Modal(document.getElementById('editHotelModal'));
        editHotelModal.show();
    };


    $('#editHotelForm').submit(function(e) {
        e.preventDefault(); 

        var formData = $(this).serialize(); 
        $.post('edit_hotel_handler.php', formData, function(response) {
            if (response.success) {
                location.reload(); 
            } else {
                alert('Error updating hotel: ' + response.error);
            }
        }, 'json');
    });

?>