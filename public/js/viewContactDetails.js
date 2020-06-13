const app = angular.module('viewContactApp', ['ngSanitize', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'datatables', 'datatables.buttons', "chart.js"]);
//Datatable Configuration
app.run(['DTDefaultOptions', function(DTDefaultOptions) {
    DTDefaultOptions.setOption('lengthMenu', [
        [10, 20, 25, 50, -1],
        [10, 20, 25, 50, 'All']
    ]);
}]);


//Controller For Index Page
app.controller('viewContactAppController', ["$scope", "$http", "$uibModal", "$window", 'DTOptionsBuilder', 'DTColumnBuilder', function($scope, $http, $uibModal, $window, DTOptionsBuilder, DTColumnBuilder){
    //Method To Initialize Controller
    $scope.initController = function(contactId){

        $scope.getContactDetails(contactId);
    
    }
    
    $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

    //Method To Get Severs List
    $scope.getContactDetails = function(contactId){
        $scope.showLoader("Getting Contacts Details, Please Wait");
        $http.get(`/getContactDetails/${contactId}`).then(function(res){
            console.log(res)
            $scope.loaderModalInstance.close();
            if(res.status == 200){
                $scope.contact = res.data[0];
                $scope.data = [res.data[0].count];
                $scope.labels = res.data[0].date;
            }else
                alertify.error("Failed To Contacts");
        })
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
}]);
