# Daily Die Api
This application allows users to log and manage their daily meals. Each user can create an account, record meals with details such as name, description, date and time, and indicate whether the meal is within the diet. Additionally, users can edit and delete their meals, view a complete list of all their meals, or details of a specific meal. The application also provides metrics on the users' eating habits, such as the total number of meals logged, meals within or outside the diet, and the best sequence of meals within the diet.

## Application Rules

- [x] It must be possible to create a user
- [x] It must be possible to identify the user between requests
- [x] It must be possible to log a meal with the following information:
    
    *Meals must be related to a user.*
    
    - Name
    - Description
    - Date and Time
    - Whether it is within the diet or not
- [x] It must be possible to edit a meal, allowing all the above data to be changed
- [x] It must be possible to delete a meal
- [x] It must be possible to list all meals of a user
- [x] It must be possible to view a single meal
- [x] It must be possible to retrieve user metrics
    - [x] Total number of meals logged
    - [x] Total number of meals within the diet
    - [x] Total number of meals outside the diet
    - [x] Best sequence of meals within the diet
- [x] The user can only view, edit, and delete meals they created
