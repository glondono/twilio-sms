#Getting ready
twilio-sms is an add-on for google sheet that use Twilio API to send SMS using cellphones numbers in a column. Also, it helps you collect responses for those SMS. You can use this app for marketing campaings, tracking volunteer schedules, coupon distrubtion and many other scenarios.

[Google add-on on chrome store](https://chrome.google.com/webstore/detail/jjaedddghkgdllndjomdnhahflbponfn/publish-review)

Once the add on is installed, you will have a new Menu item `SMS`

![alt 'Twilio-sms menu'](https://github.com/glondono/twilio-sms/blob/master/menu.png)

##Twilio account
First you need an account with Twilio. You can create a free acount and get a number for testing, but if you want to send an SMS to more than one person, you need to upgrade your account.

[Starting your trial with twilio](https://support.twilio.com/hc/en-us/articles/223136107-How-does-Twilio-s-Free-Trial-work-)

[Your twilio console](https://twilio.com/console)

##Setting your number and authorization
Once you have created your twilio account, go to the console and check for you `ACCOUNT SID` and `AUTH TOKEN`.
If you dont have a phone number, please go ahead and create a new one, you will need it.

![alt 'Twilio console'](https://github.com/glondono/twilio-sms/blob/master/account.png)

Go to your google sheet, and under SMS look for Settings.

![alt 'Twilio-SMS settings page'](https://github.com/glondono/twilio-sms/blob/master/settings.png)

Use `Enable SEND and RESPONSE history` if you want the addon to create a new sheet to keep track of the calls for SEND and RECEIVE.

![alt 'Twilio-SMS history'](https://github.com/glondono/twilio-sms/blob/master/history.png)

#Send
In your google sheet, under SMS look for SEND

![alt 'Twilio-SMS Send page'](https://github.com/glondono/twilio-sms/blob/master/send.png)

Craft your message (up to 100 characters), type the column that holds your cellphones numbers.

`NOTE: Please don't use parenthesis ( ) or dash on your cellphone numbers. Only numeric digits`

If you want to use the remind feature, check the box and type the column with the responses. We will skip those who already replied and we will mark them BLUE.

When sending an SMS, if Twilio successfully receive our request for delivery we will mark the cellphone number GREEN.  
RED will tell you that the SMS for that particular cellphone number was not able to be delivered.

#Receive
When people start replying to your SMS, those will be stored in Twilio's logs. 
To retreive those logs back to your sheet, open the Responses options under SMS.

![alt 'Twilio-SMS Response page'](https://github.com/glondono/twilio-sms/blob/master/responses.png)

Specify the column with the cellphones numbers and the column you want to store the responses. We will go ahead and retreive those logs, match them with the corresponding phone number, extract the content and put it right on the column you specify you want it.

The date we used as cut off for is set automatically based on the last time you check for responses or you send an SMS, but you can change it.


