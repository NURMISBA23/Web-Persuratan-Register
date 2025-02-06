    $(function () {

        /* initialize the external events
        -----------------------------------------------------------------*/
        function ini_events(ele) {
        ele.each(function () {
            var eventObject = {
            title: $.trim($(this).text())
            }

            $(this).data('eventObject', eventObject)

            $(this).draggable({
            zIndex        : 1070,
            revert        : true,
            revertDuration: 0
            })
        })
        }

        ini_events($('#external-events div.external-event'))

        /* initialize the calendar
        -----------------------------------------------------------------*/
        var date = new Date()
        var d    = date.getDate(),
            m    = date.getMonth(),
            y    = date.getFullYear()

        var Calendar = FullCalendar.Calendar;
        var Draggable = FullCalendarInteraction.Draggable;

        var containerEl = document.getElementById('external-events');
        var checkbox = document.getElementById('drop-remove');
        var calendarEl = document.getElementById('calendar');

        new Draggable(containerEl, {
        itemSelector: '.external-event',
        eventData: function(eventEl) {
            return {
            title: eventEl.innerText,
            backgroundColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
            borderColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
            textColor: window.getComputedStyle(eventEl, null).getPropertyValue('color'),
            };
        }
        });

        var calendar = new Calendar(calendarEl, {
        plugins: [ 'bootstrap', 'interaction', 'dayGrid', 'timeGrid' ],
        header    : {
            left  : 'prev,next today',
            center: 'title',
            right : 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        'themeSystem': 'bootstrap',
        editable  : true,
        droppable : true,
        drop      : function(info) {
            if (checkbox.checked) {
            info.draggedEl.parentNode.removeChild(info.draggedEl);
            }
        },
        events: [
            {
            title: 'Pelatihan Daerah',
            start: '2024-02-18',
            end: '2024-02-26',
            backgroundColor: '#FF9800',
            textColor: '#000'
            },
            {
            title: 'Presentasi Tugas Besar',
            start: '2024-02-28',
            end: '2024-03-02',
            backgroundColor: '#424769',
            textColor: '#000'
            },
            {
            title: 'Pengukuhan Calon Anggota',
            start: '2024-03-02',
            end: '2024-03-04',
            backgroundColor: '#304D30',
            textColor: '#000'
            },
            {
            title: 'Pemilihan Jurusan',
            start: '2024-03-05',
            end: '2024-03-10',
            backgroundColor: '#88AB8E',
            textColor: '#000'
            },
            {
            title: 'Coconut Open Class',
            start: '2024-03-23',
            end: '2024-03-26',
            backgroundColor: '#3559E0',
            textColor: '#000'
            },
            {
            title: 'Milad ke-16 & Buka Bersama',
            start: '2024-04-01',
            end: '2024-04-02',
            backgroundColor: '#39A7FF',
            textColor: '#000'
            },
            {
            title: 'IT Camp',
            start: '2024-04-27',
            end: '2024-04-29',
            backgroundColor: '#164863',
            textColor: '#000'
            },
            {
            title: 'IT Fest',
            start: '2024-05-17',
            end: '2024-05-18',
            backgroundColor: '#FFC436',
            textColor: '#000'
            },
            {
            title: 'Coconut Open Class',
            start: '2024-06-09',
            end: '2024-06-11',
            backgroundColor: '#3559E0',
            textColor: '#000'
            },
            {
            title: 'Kunjungan Industri',
            start: '2024-06-12',
            end: '2024-06-13',
            backgroundColor: '#C07F00',
            textColor: '#000'
            },
            {
            title: 'IT Camp',
            start: '2024-07-20',
            end: '2024-07-22',
            backgroundColor: '#164863',
            textColor: '#000'
            },
            {
            title: 'Coconut Open Class',
            start: '2024-08-03',
            end: '2024-08-05',
            backgroundColor: '#3559E0',
            textColor: '#000'
            },
            {
            title: 'Uprading Anggota',
            start: '2024-08-19',
            end: '2024-08-25',
            backgroundColor: '#A9A9A9',
            textColor: '#000'
            },
            {
            title: 'Musyawarah Besar',
            start: '2024-09-13',
            end: '2024-09-15',
            backgroundColor: '#408E91',
            textColor: '#000'
            },
        ]
        });

        calendar.render();

        var currColor = '#3c8dbc'
        var colorChooser = $('#color-chooser-btn')
        $('#color-chooser > li > a').click(function (e) {
        e.preventDefault()
        currColor = $(this).css('color')
        $('#add-new-event').css({
            'background-color': currColor,
            'border-color'    : currColor
        })
        })
        $('#add-new-event').click(function (e) {
        e.preventDefault()
        var val = $('#new-event').val()
        if (val.length == 0) {
            return
        }

        var event = $('<div />')
        event.css({
            'background-color': currColor,
            'border-color'    : currColor,
            'color'           : '#fff'
        }).addClass('external-event')
        event.html(val)
        $('#external-events').prepend(event)

        ini_events(event)

        $('#new-event').val('')
        })
    })