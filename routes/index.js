const router = require('express').Router();

const atob = require('atob');

const isLoggedIn = require('../lib/isLoggedIn');

//Method To Render Index Page
router.get('/',(req, res)=>res.render('login/index',{email: '', password: '', error: false, errorMessage: ''}));

//_______________________________  Routes For Log In Page _______________________________________
const logInController = require('../controllers/logIn.controller');
//Method To Render LogIn Page
router.get('/login', (req, res)=> res.render('login/index',{email: '', password: '', error: false, errorMessage: ''}));

//Method To Log In User
router.post('/logIn', logInController.userLogIn);

//*********************************** Methods For Managing Contacts **************************************/
const contactController = require('../controllers/manageContacts.controller');

//Method To Render Manage Contacts Page
router.get('/manageContacts', isLoggedIn, (req, res)=> res.render('manageContacts/index', {title: "Manage Contacts"}));


//Method To Get Contacts List
router.get('/manageContact', isLoggedIn, contactController.getAllContacts);


//Method To Create Contact
router.post('/manageContact', isLoggedIn, contactController.createContact);

//Method To Uploade Contact Image
router.post('/manageContact/uploadContactImage', isLoggedIn, contactController.uploadProductImages);

//Method To Update Contact
router.put('/manageContact/:id', isLoggedIn, contactController.updateContactDetails);

//Method To Delete Contact
router.delete('/manageContact/:id', isLoggedIn, contactController.deleteContact);

//Method To Change Contact Status
router.get('/addOrUpdateViewsCount/:contactId', contactController.addOrUpdateViewsCount);


//Method To Render Get Contact Details Page
router.get('/viewContact/:contactId', isLoggedIn, (req, res) => res.render('viewContactDetails/index', {title: "Contcat Details",contactId: atob(req.params.contactId).split(':')[1]}));

//Method To Get Contact Details
router.get('/getContactDetails/:contactId',isLoggedIn, contactController.getContactDetails);


module.exports = router;