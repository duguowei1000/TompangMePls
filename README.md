# tompangpls
Techstack:    
1) Javascript  
2) MongoDB  
3) Grammy (typescript library) - nodejs wrapper for telegram

Context: Volunteers going to Animal lodge have to walk a long journey from the nearest busstop (abt 15mins and outdoors).  

Solution: Using a Telegram Bot to coordinate a carpool (Grab/Taxi) or if there is a Driver, they can hitch together to destination.  

This bot serves to connect people who are going/leaving Animal lodge at the same time and gather them at the MRT of their choice (Jurong East(JE) or Choa Chu Kang(CCK)). 

__Action__      
__Telegram bot : Please add @tompangplsbot__. 

User Flow:
![alt text](./tree/main/pics/1.png)


Users  indicate:  
1) Going/Leaving Animal Lodge
2) Passenger/Driver
3) If Driver( how many passengers they can take?)
4) Which Day?
5) Preferred Time
6) Output: Suggested Timeslots for users to choose
7) Once timeslot chosen, user will be issued an invite link to join. 
8) In their respective telegram grps, it will be up to them to decide whether to carry out a carpool/ driver hitch and the exact place to meet:)
