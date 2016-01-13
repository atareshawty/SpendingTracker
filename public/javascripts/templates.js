(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['user_template'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "  <tr>\n    <td class=\"cost\">$"
    + alias2(alias1((depth0 != null ? depth0.cost : depth0), depth0))
    + "</td>\n    <td class=\"category\">"
    + alias2(alias1((depth0 != null ? depth0.category : depth0), depth0))
    + "</td>\n    <td class=\"location\">"
    + alias2(alias1((depth0 != null ? depth0.location : depth0), depth0))
    + "</td>\n    <td class=\"date\">"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>\n  </tr>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "      <option>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\n<h1>Welcome, "
    + alias4(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"username","hash":{},"data":data}) : helper)))
    + "!</h1>\n<canvas class=\"chart\"></canvas>\n<table class=\"spending-table\">\n  <tr>\n    <th>Cost</th>\n    <th>Category</th>\n    <th>Location</th>\n    <th>Date</th>\n  </tr>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.spending : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</table>\n<h3>Total Spending: $"
    + alias4(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"total","hash":{},"data":data}) : helper)))
    + "</h3>\n\n<!-- Get customized user categories -->\n<h2>Want your own Categories?</h2>\n<form name=\"categories\" id=\"customize\" method=\"post\" action=\"/spending/category\">\n  <label>Category</label>\n  <input type=\"text\" id=\"customCategory\", name=\"category\", placeholder=\"Make your own!\">\n  <input id=\"submitCategory\" type=\"submit\" value=\"Submit\" class=\"btn btn-primary\" disabled=\"disabled\">\n</form>\n\n<!-- Date Range Filter Selector -->\n<form name=\"filter\" id=\"filter\" method=\"get\">\n  <label>From</label>\n  <input type=\"text\" id=\"from\" name=\"from\", placeholder=\"2015-01-01\">\n  <label>To</label>\n  <input type=\"text\" id=\"to\" name=\"to\", placeholder=\"2015-01-31\">\n  <input id=\"submitDate\" type=\"submit\" value=\"Submit\" class=\"btn btn-primary\" disabled=\"disabled\">\n</form>\n\n<!-- Submit more spending data -->\n<form name=\"input\" id=\"inputForm\" method=\"post\" action=\"/spending/purchase\">\n  <label>Cost</label>\n  <input id=\"POST-cost\" type=\"text\", name=\"cost\" id=\"cost\", placeholder=\"Ex: 10.99\">\n  <label>Category</label>\n  <select id=\"POST-category\" name=\"category\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </select>\n  <label>Location</label>\n  <input id=\"POST-location\" type=\"text\", name=\"location\", placeholder=\"Ex: AMC Theater\">\n  <label>Date</label>\n  <input id=\"POST-date\" type=\"text\", name=\"date\", placeholder=\"Ex: 2015-10-03\">\n  <input id=\"submitData\" type=\"submit\" value=\"Submit\" class=\"btn btn-primary\" disabled=\"disabled\">\n</form>\n";
},"useData":true});
})();