structure my project

# ALL BLOCKS:

- SESSION BLOCK

        // ========== SESSION BLOCK =============
        // ========== END SESSION BLOCK =============
- USER BLOCK

        // ========== USER BLOCK =============
        // ========== END USER BLOCK =============
- TASK BLOCK

        // ========== TASK BLOCK =============
        // ========== END TASK BLOCK =============
- MASSAGE BLOCK

        // ========== MASSAGE BLOCK =============
        // ========== END MASSAGE BLOCK =============



## component structure

BLOCK - COMPONENT - LOGIC


## Description of the components in the structure

- SESSION COMPONENT

        // ========== TASK - GET DATA - COMPONENT =============
        // ========== END TASK - GET DATA - TASK COMPONENT =============

- SESSION LOGIC 

        // ========== TASK - GET DATA - COMPONENT - FILTER TASK - LOGIC  =============
        // ========== END TASK - GET DATA - TASK COMPONENT =============



# ALL COMPONENTS:

- TASK - SAVE DATA COMPONENT

this is a component that saves data to the server

        // ========== TASK - SAVE DATA - COMPONENT =============
        // ========== END TASK - SAVE DATA - TASK COMPONENT =============

| BLOCKS  |                          |   |
|:-------:|:------------------------:|:-:|
| SESSION |                          | 2 |
|  USER   |                          |   |
|  TASK   |                          |   |
| MASSAGE | GET DATA, <br/>SAVE DATA |   |
|         |                          |   |
|         |                          |   |
|         |                          |   |