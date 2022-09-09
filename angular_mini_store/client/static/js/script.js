var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getRespondingTag(days) {
    if (days <= 1) {
        return days + "st";
    } else if (days == 2) {
        return days + "nd";
    } else if (days == 3) {
        return days + "rd";
    } else {
        return days + "st";
    }
}

var app = angular.module('angularMiniStore', ['ngRoute', 'ngMessages']);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/customers.html'
    }).when('/customers', {
        templateUrl: '/partials/customers.html'
    }).when('/orders', {
        templateUrl: '/partials/orders.html'
    }).otherwise({
        redirectTo: '/'
    });
});

app.factory('customerFactory', function() {
    var customers = [];
    var factory = {};

    factory.get_customers = function(callback) {
        callback(customers);
    }

    factory.add_customer = function(new_customer) {
        customers.push(new_customer);
    }

    factory.remove_customer = function(customer) {
        customers.splice(customers.indexOf(customer), 1);
    }

    factory.get_customer = function(name) {
        for (var i in customers) {
            if (customers[i].name == name) {
                return customers[i];
            }
        }

        return null;
    }

    return factory;
});

app.controller('customersController', function($scope, customerFactory) {
    $scope.customers = [];

    customerFactory.get_customers(function(data) {
        $scope.customers = data;
    });

    $scope.format_date = function(date) {
        return months[date.getMonth()] + " " + getRespondingTag(date.getDay()) + " " + date.getFullYear();
    }

    $scope.exists = function() {
        for (var i in $scope.customers) {
            if ($scope.customers[i].name == $scope.customers_form.name.$viewValue) {
                return true;
            }
        }

        return false;
    }

    $scope.add_customer = function() {
        if ($scope.new_customer && $scope.new_customer != {} && !$scope.exists()) {
            $scope.new_customer.created_at = new Date();
            $scope.new_customer.orders = {};
            customerFactory.add_customer($scope.new_customer);
            $scope.new_customer = {};
        }
    }

    $scope.remove_customer = function(customer) {
        customerFactory.remove_customer(customer);
    }
});

app.controller('ordersController', function($scope, customerFactory) {
    $scope.customers = [];
    $scope.new_order = {};

    customerFactory.get_customers(function(data) {
        $scope.customers = data;
    });

    $scope.format_date = function(date) {
        return months[date.getMonth()] + " " + getRespondingTag(date.getDay()) + " " + date.getFullYear();
    }

    $scope.add_order = function() {
        console.log($scope.new_order);
        var customer = customerFactory.get_customer($scope.new_order.customer);

        if (customer.orders[$scope.new_order.product] == undefined) {
            customer.orders[$scope.new_order.product].quantity = parseInt($scope.new_order.quantity);
        } else {
            customer.orders[$scope.new_order.product].quantity += parseInt($scope.new_order.quantity);
        }

        customer.orders[$scope.new_order.product].created_at  = new Date();
        $scope.new_order = {};
    }
});
