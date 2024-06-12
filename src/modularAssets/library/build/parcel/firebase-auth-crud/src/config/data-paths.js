class DataPaths {
    base = {
        state: 'state',
        users: 'users',
    }

    extension = {
        userTeam1: 'team-1',
        userTeam2: 'team-2',
        cities: 'cities',
    }

    globalBasePath = this.base.state
    globalExtensionPath = this.extension.cities
}

export default new DataPaths()