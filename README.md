# Traveloop

## Database Modelling & Tables

### Users

- id
- firstname
- lastname
- email
- password
- country
- city
- phone number

### Trips

- id
- userid
- title
- description
- cover_image_url (optional)
- start_date
- end_date
- created_at

### Cities

- id
- name
- country
- latitude
- longitude
- id
- trip_id
- city_id
- start_date
- end_date
- order_index
- budget

### Activities

Data of all activities in a city

- id
- city_id
- title
    
### Trip_Stops
    
- description
- category - physical/accomodation/dining/landmarks
- cost
- duration
- image_url

### Trip_Activities

Activities added to a user's trip 

- id
- activity_id
- tripstop_id
- activity_date
- start_time
- end_time (can be calculated)
- cost (entered by user, use default from Activities table)

### Packing_Items

- id
- trip_id
- item_name
- category
- is_packed

### Notes

- id
- trip_id
- stop_id (to be decided)
- content
- created_at

### Shared_Trips

- id
- trip_id
- public_link
- created_at

### Community

- id
- user_id
- trip_id
- caption
- created_at