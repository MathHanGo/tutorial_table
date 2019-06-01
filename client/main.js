import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { check } from 'meteor/check'
import { Session } from 'meteor/session';
import './main.html';
import {Meteor} from "meteor/meteor";

const Records = new Meteor.Collection('records');

Template.leaderboard.onCreated(function created(){
    this.autorun(()=>{
        Meteor.subscribe('query_name', Session.get('selector'));
    })
});
Template.leaderboard.helpers({
    selectors: function () {
        // var selector = Session.get('selector');
        // if(selector!=undefined) {
        return Records.find();

        // }else{
        //     return Records.find({"report_date":"31/05/2019"});
        // }
    },


    tableSettings : function () {
        return {
            fields: [
                { key: 'report_date', label: 'Report Date'},
                { key: 'stock_code', label: 'Stock Code'},
                { key: 'stock_name', label: 'Stock Name'},
                { key: 'mkt_cap', label:'Market Cap'},
                { key: 'director_name', label: 'Director Name'},//, fn: function (director_name) { return director_name}}
                { key: 'position', label:'Director Position'},
                { key: 'shares_in_event', label: 'Shares Number'},
                { key: 'changes_after_event', label: 'Changes (After Event)'},
                // { key: 'changes_1month', label: 'Changes (1month)'},
                { key: 'avg_px', label: 'Average Price'},
                { key: 'event_date', label: 'Event Date'},
                { key: 'serial_number', label: 'Serial Number',  fn: function (serial_number,object) {
                        return new Spacebars.SafeString("<a href="+object['serial_link']+">"+serial_number+"</a>");
                    }}
            ]
        };
    }
});
Template.leaderboard.events({
    'input.report_date' : function() {
        var input_date = $('input[name="date"]').val().split("-");
        var format_date = input_date[2]+"/"+input_date[1]+"/"+input_date[0];
        Session.set('selector', {'report_date':format_date});
    },
    'keypress input.stock_code' : function () {
        var input_code = $('input[name="text"]').val()
        Session.set('selector', {'stock_code':input_code});
    }
});


// Template.player.helpers({
//     selected : function () {
//         return Session.equals("selected_player", this._id) ? "selected" : '';
//     }
// });
//
// Template.leaderboard.events({
//     'click input.inc': function () {
//         Players.update(Session.get("selected_player"), {$inc: {score: 5}});
//     }
// });
//
// Template.player.events({
//     'click': function () {
//         Session.set("selected_player", this._id);
//     }
// });
