(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['income_tracker_template'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "  <tr>\n    <td class=\"cost\" style=\"width: 13%\">"
    + alias2(alias1((depth0 != null ? depth0.formattedCost : depth0), depth0))
    + "</td>\n    <td class=\"category\" style=\"width: 17%\">"
    + alias2(alias1((depth0 != null ? depth0.category : depth0), depth0))
    + "</td>\n    <td class=\"location\" style=\"width: 34%\">"
    + alias2(alias1((depth0 != null ? depth0.location : depth0), depth0))
    + "</td>\n    <td class=\"date\" style=\"width: 18%\">"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>\n    <td style=\"width: 18%\"><button class=\"income-delete-button btn btn-sm btn-danger\" id="
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"index","hash":{},"data":data}) : helper)))
    + ">Delete</button></td>\n  </tr>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<table style=\"width: 100%; table-layout: fixed; text-align: left;\">\n<tr>\n  <th style=\"width: 12%\">Cost</th>\n  <th style=\"width: 17%\">Category</th>\n  <th style=\"width: 33%\">Location</th>\n  <th style=\"width: 38%\">Date</th>\n</tr>\n  </table>\n<div class=\"income-table-container\">\n<table class=\"spending-table\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.income : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</table>\n</div>\n<h3>Total Income: "
    + container.escapeExpression(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"total","hash":{},"data":data}) : helper)))
    + "</h3>";
},"useData":true});
templates['spending_table_template'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "  <tr>\n    <td class=\"cost\" style=\"width: 13%\">"
    + alias2(alias1((depth0 != null ? depth0.formattedCost : depth0), depth0))
    + "</td>\n    <td class=\"category\" style=\"width: 17%\">"
    + alias2(alias1((depth0 != null ? depth0.category : depth0), depth0))
    + "</td>\n    <td class=\"location\" style=\"width: 34%\">"
    + alias2(alias1((depth0 != null ? depth0.location : depth0), depth0))
    + "</td>\n    <td class=\"date\" style=\"width: 18%\">"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>\n    <td style=\"width: 18%\"><button class=\"purchase-delete-button btn btn-sm btn-danger\" id="
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"index","hash":{},"data":data}) : helper)))
    + ">Delete</button></td>\n  </tr>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<table style=\"width: 100%; table-layout: fixed; text-align: left;\">\n<tr>\n  <th style=\"width: 12%\">Cost</th>\n  <th style=\"width: 17%\">Category</th>\n  <th style=\"width: 33%\">Location</th>\n  <th style=\"width: 38%\">Date</th>\n</tr>\n  </table>\n<div class=\"spending-table-container\">\n<table class=\"spending-table\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.spending : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</table>\n</div>\n<h3>Total Spending: "
    + container.escapeExpression(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"total","hash":{},"data":data}) : helper)))
    + "</h3>";
},"useData":true});
templates['user_template'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "            <option>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<h2 class=\"spending-table-header\">Spending</h2>\n<div class=\"columns spending-info\">\n  <div class=\"one-half column\">\n    <div class=\"chart-container\">\n      <canvas class=\"chart\"></canvas>\n    </div>\n  </div>\n  <div class=\"one-half column\">\n      <div class=\"spending-table-placeholder\"></div>\n  </div>\n</div>\n\n<hr />\n\n<h2 class=\"spending-table-header\">Income</h2>\n<div class=\"columns\">\n  <div class=\"one-half column\">\n    <div class=\"income-chart-container\">\n      <canvas class=\"income-chart\"></canvas>\n    </div>\n  </div>\n  <div class=\"one-half column\">\n      <div class=\"income-table-placeholder\"></div>\n  </div>\n</div>\n\n<hr />\n<div class=\"columns\">\n  <div class=\"one-half column\">\n    <!-- Get customized user categories -->\n    <div class=\"category-form\">\n      <dl class=\"form\">\n        <dt><h3>Create a Category</h3></dt>\n        <dd><label>Category</label></dd>\n        <dd><input type=\"text\" id=\"customCategory\", name=\"category\", placeholder=\"Make your own!\"></dd>\n        <dd class=\"label-button-padding\"><input id=\"submitCategory\" type=\"submit\" value=\"Submit\" class=\"btn btn-primary\" disabled=\"disabled\"></dd>\n      </dl>\n    </div>\n\n    <hr />\n\n    <!-- Date Range Filter Selector -->\n    <dl class=\"form\">\n      <dt><h3>Filter Your Spending</h3></dt>\n      <dd><label>From</label></dd>\n      <dd><input type=\"text\" id=\"from\" name=\"from\", placeholder=\"2015-01-01\"></dd>\n      <dd class=\"label-button-padding\"><label>To</label></dd>\n      <dd><input type=\"text\" id=\"to\" name=\"to\", placeholder=\"2015-01-31\"></dd>\n      <dd class=\"label-button-padding\"><input id=\"submitDate\" type=\"submit\" value=\"Submit\" class=\"btn btn-primary\" disabled=\"disabled\"></dd>\n    </dl>\n  </div>\n\n  <div class=\"one-half column\">\n    <!-- Submit more spending data -->\n    <div class=\"purchase-form\">\n      <dl class=\"form\">\n        <dt><h3>Add a Purchase or Income</h3></dt>\n        <dd><label>Cost</label></dd>\n        <dd><input id=\"POST-cost\" type=\"text\", name=\"cost\" id=\"cost\", placeholder=\"Ex: 10.99\"></dd>\n        <dd class=\"label-button-padding\"><label>Category</label></dd>\n        <dd>\n          <select id=\"POST-category\" name=\"category\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "          </select>\n        </dd>\n        <dd class=\"label-button-padding\"><label>Location</label></dd>\n        <dd><input id=\"POST-location\" type=\"text\", name=\"location\", placeholder=\"Ex: AMC Theater\"></dd>\n        <dd class=\"label-button-padding\"><label>Date</label></dd>\n        <dd><input id=\"POST-date\" type=\"text\", name=\"date\", placeholder=\"Ex: 2015-10-03\"></dd>\n        <dd class=\"label-button-padding\"><input id=\"submitData\" type=\"submit\" value=\"Submit\" class=\"btn btn-primary\" disabled=\"disabled\"></dd>\n      </dl>\n    </div>\n  </div>\n</div>\n";
},"useData":true});
})();