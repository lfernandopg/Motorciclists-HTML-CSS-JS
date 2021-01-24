const Motorcyclists = 8

var Schedules = []

var Users = []

var actual_user = null

const isFull = schedule => {
    return schedule.users_id.length === Motorcyclists
}

const fetchSchedules = () => {
    let initialSchedules = JSON.parse(localStorage.getItem('schedules-motorcyclists'))
    if (!initialSchedules) {
        $.ajax({
            async: false,
            type: 'get',
            url: 'https://api.jsonbin.io/b/600ccec73126bb747e9e209a',
            success: data => {
                Schedules = data
                localStorage.setItem('schedules-motorcyclists', JSON.stringify(Schedules))
            }
        })
    } else {
        Schedules = initialSchedules
    }
}

const fetchUsers = () => {
    let initialUsers = JSON.parse(localStorage.getItem('users-motorcyclists'))
    if (!initialUsers) {
        $.ajax({
            async: false,
            type: 'get',
            url: 'https://api.jsonbin.io/b/600cce8c3126bb747e9e208a',
            success: data => {
                Users = data
                localStorage.setItem('users-motorcyclists', JSON.stringify(Users))
            }
        })
    } else {
        Users = initialUsers
    }
}

const fetchActualUser = () => {
    let initialActualUser = JSON.parse(localStorage.getItem('actual-user-motorcyclists'))
    if (!initialActualUser && Users.length > 0) {
        actual_user = Users[0]
        localStorage.setItem('actual-user-motorcyclists', JSON.stringify(actual_user))
    } else {
        actual_user = initialActualUser
    }
}

const changeUser = id => {
    let user = Users.filter( user => (user.id == id) )[0]
    actual_user = user
    localStorage.setItem('actual-user-motorcyclists', JSON.stringify(actual_user))
}

const renderRow =  schedule => {
    if (schedule.users_id.includes(actual_user.id)) {
        $('tbody').append(
            `<tr 
                data-id="${schedule.id}" 
                class="requested"
            >
                <td>${schedule.hour}</td>
                <td>${Motorcyclists - schedule.users_id.length}</td>
                <td>Solicitado</td>
            </tr>`
        ).hide().show('normal')
    } else if (isFull(schedule)) {
        $('tbody').append(
            `<tr 
                data-id="${schedule.id}" 
                class="taken"
            >
                <td>${schedule.hour}</td>
                <td>${Motorcyclists - schedule.users_id.length}</td>
                <td>Ocupado</td>
            </tr>`
        ).hide().show('normal')
    } else {
        $('tbody').append(
            `<tr 
                data-id="${schedule.id}"
            >
                <td>${schedule.hour}</td>
                <td>${Motorcyclists - schedule.users_id.length}</td>
                <td>Disponible</td>
            </tr>`
        ).hide().show('normal')
    }
}

const renderListUser = user => {
    $('.list').find('li').append(
        `<ul><span class="list-user" data-id="${user.id}">${user.name}</span></ul>` 
    )
}

const renderActualUser = user => {
    $('.name').text(actual_user.name).hide().show('normal')
    $('.user').find('img').attr('src', `img/${actual_user.img}`).hide().show('normal')
}

const render = () => {

    Schedules.forEach(schedule => {
        renderRow(schedule)
    })

    Users.filter( user => (user.id !== actual_user.id) )
    .sort( (a,b) => {
        if (a.name > b.name ) {
            return 1
        }
        if (a.name  < b.name ) {
            return -1
        }
            return 0
    })
    .forEach( user => {
        renderListUser(user)
    })

    renderActualUser()

    $('tbody tr').on('click', function() {
        let id = $(this).attr('data-id')
        let schedule = Schedules.filter( schedule => (schedule.id == id) )[0]
        if (schedule.users_id.includes(actual_user.id)) {
            schedule.users_id = schedule.users_id.filter(id => (id !== actual_user.id) )
            $(this).removeClass('requested').hide().show('normal')
            $(this).find('td:eq(1)').text(Motorcyclists - schedule.users_id.length)
            $(this).find('td:eq(2)').text("Disponible")
            localStorage.setItem('schedules-motorcyclists', JSON.stringify(Schedules))
        } else if (!isFull(schedule)) {
            schedule.users_id.push(actual_user.id)
            $(this).addClass('requested').hide().show('normal')
            $(this).find('td:eq(1)').text(Motorcyclists - schedule.users_id.length)
            $(this).find('td:eq(2)').text("Solicitado")
            localStorage.setItem('schedules-motorcyclists', JSON.stringify(Schedules))
        }
    })

    $('.list-user').on('click', function() {
        let id = $(this).attr('data-id')
        changeUser(id)
        $('.list').hide('normal')
        $('.up-down').find('.fas').removeClass('fa-sort-down').hide('normal')
        $('.up-down').find('.fas').addClass('fa-sort-up').show('normal')
        $('.list').find('li').html('')
        $('tbody').html('')
        render()
    })
}

$(document).ready( function() {
    fetchUsers()
    fetchActualUser()
    fetchSchedules()
    render()

    $('.up-down').on('click', function() {
        if ($('.list').css('display') == 'none') {
            $('.list').show('normal')
            $('.up-down').find('.fas').removeClass('fa-sort-up').hide('normal')
            $('.up-down').find('.fas').addClass('fa-sort-down').show('normal')
        } else {
            $('.list').hide('normal')
            $('.up-down').find('.fas').removeClass('fa-sort-down').hide('normal')
            $('.up-down').find('.fas').addClass('fa-sort-up').show('normal')
        }
    })
}) 