const app = angular.module('manageContactApp', ['ngSanitize', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'datatables', 'datatables.buttons', 'ngFileUpload']);
//Datatable Configuration
app.run(['DTDefaultOptions', function(DTDefaultOptions) {
    DTDefaultOptions.setOption('lengthMenu', [
        [10, 20, 25, 50, -1],
        [10, 20, 25, 50, 'All']
    ]);
}]);


//Controller For Index Page
app.controller('manageContactAppController', ["$scope", "$http", "$uibModal", "$window", 'DTOptionsBuilder', 'DTColumnBuilder', "Upload", function($scope, $http, $uibModal, $window, DTOptionsBuilder, DTColumnBuilder, Upload){
    //Method To Initialize Controller
    $scope.initController = function(){
        $scope.getContacts();
        $scope.availableContactList = [];
    }



    //Method To Get Severs List
    $scope.getContacts = function(){
        $scope.showLoader("Getting Contacts List, Please Wait");
        $http.get('/manageContact').then(function(res){
            console.log(res)
            $scope.loaderModalInstance.close();
            if(res.status == 200){
                $scope.contactsList = res.data;
            }else
                alertify.error("Failed To Contacts");
        })
    }

    //Method To Remove Contact
    $scope.removeContact = function(id, url, index){
        console.log(id)
        alertify.confirm(`Delete Contact ${url}`, `Do You Really Want To Delete ${url} Contact?`, function() {
            $http.delete(`/manageContact/${id}`).then(function(response) {
                if (response.status === 200) {
                    $scope.contactsList.splice(index, 1);
                    alertify.success("Contact deleted successfully");
                } else
                    alertify.error("Something Went Wrong While Deleting Seller");
            })
        }, function() {
            alertify.message("Delete Operation Cancelled");
        })
    }

    //Method Called When View Button Is Clicked
    $scope.onViewButtonClicked = function(contactId){
        $http.get(`/addOrUpdateViewsCount/${contactId}`).then(function(res){
            console.log(res)
            if(res.status == 201)
                $window.location = `/viewContact/${btoa("ContactID:"+contactId)}`;
        })
    }

   

    //Method to open modal to add or edit contact
    $scope.openModal = function(mode, data){
        let modalData = {};
        if (data !== undefined && mode !== 'add') {
            modalData = angular.copy(data);
        }
        modalData.mode = mode;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal.html',
            controller: 'manageContactDetails',
            scope: $scope,
            backdrop: false,
            size: 'lg',
            windowClass: 'show',
            resolve: {
                record: function() {
                    return modalData;
                }
            }
        });
    }

    //Method To Show Loader
    $scope.showLoader = function (message) {
        $scope.loaderModalInstance = $uibModal.open({
            // animation: true,
            template: `<div class="bd-example-modal-lg" data-backdrop="static"  data-keyboard="false">
                <div class="modal-dialog  modal-lg">
                    <div class="modal-content bg-transparent">
                        <div class="row">
                            <div style="width: 500px; margin-left: 45%;">
                                <span class="fa  fa-spinner fa-pulse fa-3x text-primary"></span>
                            </div>
                            <div style="width: 500px; margin-left: 1%; margin-top: 2%;">
                                <h6 class="text-center">{{record}}</h6>
                            </div>
                        </div>
                    </div>

                </div>
            </div>`,
            size: 'sm',
            backdrop: false,
            keyboard: false,
            windowClass: 'show',
            controller: function($scope, record){
                function init(){
                    $scope.record = record;
                }
                init();
               
            },
            resolve: {
                record: function() {
                    return message;
                }
            }
        });
    };

    //______________________________ Method To Show Progress Circle _________________________
    $scope.showProgressCircle = function() {
        $scope.loaderModal = $uibModal.open({
            animation: true,
            template: `<div class="bg-white rounded-lg p-5 shadow">
        <div class="progress mx-auto" data-value='{{progress}}'>
          <span class="progress-left">
                        <span class="progress-bar border-danger"></span>
          </span>
          <span class="progress-right">
                        <span class="progress-bar border-danger"></span>
          </span>
          <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
            <div class="h2 font-weight-bold">{{progress}}<sup class="small">%</sup></div>
          </div>
        </div>
         <h2 class="h6 mt-4 font-weight-bold text-center mb-4">Creating Product, Please Wait..</h2>
</div>`,
            controller: function($scope) {},
            scope: $scope,
            backdrop: false,
            size: 'lg',
            windowClass: 'show'
        })
    }
}]);


//Controller For Add Or Edit Contact Modal
app.controller("manageContactDetails", ["$scope", "$http", "record", "Upload", function($scope, $http, record, Upload){
    $scope.errorMessages = [];
    //Method To Initialize Controller
    function init(){
        $scope.contact = record;
    }

    init();


    //Method Called When File Is Selected
    $scope.onFileSelected = function(){
        console.log($scope.contact.myFiles)
    }
    
    $scope.progress = 0;
    //Method To Add New Product
    $scope.uploadContactImage = function(form) {
        console.log($scope.contact.myFiles)
        if(form.$valid){
            $scope.loading = true;
            $scope.showProgressCircle();
            let myFiles = $scope.contact.myFiles;
            if ($scope.contact.myFiles) {
                Upload.upload({
                    url: '/manageContact/uploadContactImage', //webAPI exposed to upload the file
                    data: {
                        file: myFiles
                    }
                }).then(function(resp) { //upload function returns a promise
                    console.log(resp)
                    $scope.loaderModal.close();
                    if (resp.status === 200) {
                        delete $scope.contact.myFiles;
                        $scope.contact.contactPic = resp.data;
                        $http.post('/manageContact', $scope.contact).then(function(res){
                            $scope.loaderModalInstance.close();
                            if(res.status == 201){
                                alertify.success("Contact Created Successfully");
                                $scope.getContacts();
                                $scope.close();
                            }else if(res.status == 200){
                                alertify.alert("Data Validation Errors", "Please Check Validation Errors");
                                $scope.error = true;
                                $scope.errorMessages = res.data.message;
                            }else if(res.status == 500)
                                alertify.error("Failed To Create New Contact.")
                        })
                    } else {
                        alertify.error("Something Went Wrong While Adding File");
                    }
                }, function(resp) { //catch error
                    alertify.error("Something Went Wrong While Adding File")
                }, function(evt) {
                    let progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.progress = progressPercentage; // capture upload progress
                });
            } else {
                $scope.showLoader("Creating Contact, Please Wait");
                $http.post('/manageContact', $scope.contact).then(function(res){
                    $scope.loaderModalInstance.close();
                    if(res.status == 201){
                        alertify.success("Contact Created Successfully");
                        $scope.getContacts();
                        $scope.close();
                    }else if(res.status == 200){
                        alertify.alert("Data Validation Errors", "Please Check Validation Errors");
                        $scope.error = true;
                        $scope.errorMessages = res.data.message;
                    }else if(res.status == 500)
                        alertify.error("Failed To Create New Contact.")
                })
            }
        }else{
            $scope.isSubmitClicked = true;
            alertify.alert("Validation Errors", "Please Check Validation Errors");
        }
            
        
    };




    //Method To Update Contact Details 
    $scope.updateContactDetails = function(form){
        if(form.$valid){
            $scope.showLoader("Updating Contact Details, Please Wait");
            $http.put(`/manageContact/${$scope.contact._id}`, $scope.contact).then(function(res){
                $scope.loaderModalInstance.close();
                if(res.status == 201){
                    alertify.success("Contact Details Updated Successfully");
                    $scope.getContacts();
                    $scope.close();
                }else if(res.status == 200){
                    alertify.alert("Data Validation Errors", "Please Check Validation Errors");
                    $scope.error = true;
                    $scope.errorMessages = res.data.message;
                }else if(res.status == 500 || res.status === 404 )
                    alertify.error("Failed To Update Contact.")
            })
        }else
            alertify.alert("Validation Errors", "Please Check Validation Errors");
    }
    
    //MEthod To Close Modal
    $scope.close = function(){
        $scope.modalInstance.close();
    }

    
}]);


$(function() {
    $(".progress").each(function() {

        let value = $(this).attr('data-value');
        let left = $(this).find('.progress-left .progress-bar');
        let right = $(this).find('.progress-right .progress-bar');

        if (value > 0) {
            if (value <= 50) {
                right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
            } else {
                right.css('transform', 'rotate(180deg)')
                left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
            }
        }

    })

    function percentageToDegrees(percentage) {

        return percentage / 100 * 360

    }

});