const crypto = require("crypto");


class Match {

    static PLAYING_STATUS = 'PLAYING'
    static FINISHED_STATUS = 'FINISHED'
    static DEFAULT_SETS_NUMBER = 5
    static DEFAULT_SET_POINTS_NUMBER = 25
    static DEFAULT_POINTS_DIFFERENCE = 2
    static DEFAULT_TIE_BREAK_POINTS = 15
    static TEAM_ONE = 'team_one'
    static TEAM_TWO = 'team_two'

    constructor (matchJson) {
        this.teams = matchJson.teams;
        this.teams.team_one.sets = matchJson.teams.team_one.sets ? matchJson.teams.team_one.sets : 0;
        this.teams.team_two.sets = matchJson.teams.team_two.sets ? matchJson.teams.team_two.sets : 0;
        this.sets_number = matchJson.sets_number ? matchJson.sets_number : this.constructor.DEFAULT_SETS_NUMBER;
        this.set_points_number = matchJson.set_points_number ? matchJson.set_points_number : this.constructor.DEFAULT_SET_POINTS_NUMBER;
        this.points_difference = matchJson.points_difference ? matchJson.points_difference : this.constructor.DEFAULT_POINTS_DIFFERENCE;
        this.tie_break_points = matchJson.tie_break_points ? matchJson.tie_break_points : this.constructor.DEFAULT_TIE_BREAK_POINTS;
        this.status = matchJson.status ? matchJson.status : this.constructor.PLAYING_STATUS;
        this.id = matchJson.id ? matchJson.id : this.constructor.generateId();
        this.token = matchJson.token ? matchJson.token : this.constructor.generateToken();

        this.created = matchJson.created ? this.constructor.isoToDate(matchJson.created) : this.constructor.getDateTime();
        this.changed = matchJson.changed ? this.constructor.isoToDate(matchJson.changed) : this.constructor.getDateTime();
        this.sets = matchJson.sets ? matchJson.sets : [this.constructor.generateSet()];
        this.winner = matchJson.winner ? matchJson.winner : null;
    }

    static isoToDate (date) {
        if (typeof date === 'string') {
            return new Date(date);
        } else {
            return date;
        }
    }

    static generateSet () {
        return {
            'team_one': 0,
            'team_two': 0,
            'winner': null,
        }
    }

    static generateId () {
        return crypto.randomBytes(3).toString("hex");
    }

    static generateToken () {
        return crypto.randomBytes(16).toString("hex");
    }

    static getDateTime () {
        return new Date();
    }

    json () {
        return {
            'id': this.id,
            'teams': this.teams,
            'sets_number': this.sets_number,
            'set_points_number': this.set_points_number,
            'points_difference': this.points_difference,
            'tie_break_points': this.tie_break_points,
            'status': this.status,
            'token': this.token,
            'created': this.created.toISOString(),
            'changed': this.changed.toISOString(),
            'sets': this.sets,
            'winner': this.winner
        }
    }

    addPointTeam (team) {
        if (this.status == this.constructor.FINISHED_STATUS) {
            throw new Error('Operation denied');
        }
        let team_points = team == 1 ? 'team_one' : 'team_two';
        let other_team_points = team != 1 ? 'team_one' : 'team_two';
        let index = this.sets.length - 1;
        this.sets[index][team_points] = this.sets[index][team_points] + 1;
        if (
            this.sets[index][team_points] >= (this.sets[index][other_team_points] + this.points_difference ) &&
            this.sets[index][team_points] >= this.set_points_number || 
            this.sets.length == (this.sets_number) && this.sets[index][team_points] >= (this.sets[index][other_team_points] + this.points_difference ) &&
            this.sets[index][team_points] >= this.tie_break_points
        ) {
            // The set finished?

            this.teams[team_points].sets = this.teams[team_points].sets + 1; // Register that the team win a set
            this.sets[index].winner = team_points; // Register that this set was winned by the team

            if (
                this.teams[team_points].sets >= Math.ceil(this.sets_number / 2)
            ){
                // The match finished?
                this.status = this.constructor.FINISHED_STATUS;
                this.winner = team_points;
            } else {
                // Create new set
                this.sets.push(this.constructor.generateSet());
            }
        }
        if (this.model) {
            this.model.save(this);
        }
    }

    substractPointTeam (team) {
        if (this.status == this.constructor.FINISHED_STATUS) {
            throw new Error('Operation denied');
        }
        let index = this.sets.length - 1;
        let team_points = team == 1 ? 'team_one' : 'team_two';
        if (this.sets[index][team_points] == 0){
            if (this.sets.length == 1){
                throw new Error('Operation denied');
            }
            this.sets.pop();
            let index = this.sets.length - 1;
            this.teams[this.sets[index].winner].sets = this.teams[this.sets[index].winner].sets - 1;
            this.sets[index][this.sets[index].winner] = this.sets[index][this.sets[index].winner] - 1;
            this.sets[index].winner = null;
        } else {
            this.sets[index][team_points] = this.sets[index][team_points] - 1;
        }
        if (this.model) {
            this.model.save(this);
        }
    }

}

exports.Match = Match;
