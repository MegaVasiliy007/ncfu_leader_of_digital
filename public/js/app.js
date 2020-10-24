'use strict';

let overlay	= document.querySelector('.overlay'),
	mOpen	= document.querySelectorAll('[data-modal]'),
	mClose	= document.querySelectorAll('[data-close]'),
	mStatus	= false;

if (mOpen.length > 0){
	const modalShow = modal => {
		overlay.classList.remove('fadeOut');
		overlay.classList.add('fadeIn');

		modal.classList.remove('fadeOut');
		modal.classList.add('fadeIn');

		mStatus = true;
	}

	const modalClose = event => {

		if (mStatus) {
			let modals = document.querySelectorAll('.modal');

			modals.forEach(modal => {
				modal.classList.remove('fadeIn');
				modal.classList.add('fadeOut');
			});

			overlay.classList.remove('fadeIn');
			overlay.classList.add('fadeOut');
			mStatus = false;
		}
	}

	mOpen.forEach( el => {
		let modalId	= el.getAttribute('data-modal'),
			modal	= document.getElementById(modalId);
		el.addEventListener('click', (e) => {
			e.preventDefault();
			modalShow(modal);
		});
		el.addEventListener("keydown", e => {if(e.keyCode == 13)modalShow(modal);});
	});

	mClose.forEach(el =>{
		el.addEventListener('click', e => {
			e.preventDefault();
			modalClose();
		});
	});

	addEventListener("keydown", e => {if(e.keyCode == 27)modalClose();});
}

{
	const formInputs = document.querySelectorAll('.form__input');

	const fixedLabel = e => {
		const labelText = e.parentNode.querySelector('.labelText');
		if (e.value.length > 0) {
			labelText.classList.add('labelText_fixed');
		} else {
			labelText.classList.remove('labelText_fixed');
		}
	};

	if (formInputs) {
		formInputs.forEach(e => {
			fixedLabel(e);
			e.addEventListener('change', () => {
				fixedLabel(e);
			});
		});
	}
}

{
	const tabs = document.querySelectorAll('[data-tab]');

	const fTabs = e => {
		const target = e.target;
		if(target.getAttribute('data-tab')){

			const dataTab	  = target.getAttribute('data-tab'),
				  tabsContent = document.querySelectorAll('.tabsContent__item');

			for(let i = 0; i < tabs.length; i++){
				tabs[i].classList.remove('tab_active');
				tabs[i].setAttribute('tabindex', 0);
			}

			target.classList.add('tab_active');
			target.removeAttribute('tabindex');

			for( let i = 0; i < tabsContent.length; i++){
				if( dataTab == i){
					tabsContent[i].classList.add('tabsContent__item_active');
				} else{
					tabsContent[i].classList.remove('tabsContent__item_active');
				}
			}
		}
	}

	if (tabs) {
		tabs.forEach(e => {
			e.addEventListener('click', fTabs);
			e.addEventListener('keydown', e => {
				if(e.keyCode == 13){
					fTabs(e);
				}
			});
		});
	}
}

{
	const closeFilter = (el) => {
		document.addEventListener('click', e => {
			if(!el.contains(e.target))
				el.querySelector('button').classList.remove('filter__groupName_active');
		});
	}

	document.querySelectorAll('.filter__groupName').forEach( el => {
		el.addEventListener('click', e => {
			const target = e.target;
			target.classList.toggle('filter__groupName_active');
			closeFilter(target.parentNode);
		});
	});
}

{
	function modalFixView() {
		$('.modal').each(function (){
			$(this).removeAttr('style');
			$(this).innerWidth(Math.round($(this).outerWidth() / 2) * 2);
			$(this).innerHeight(Math.round($(this).outerHeight() / 2) * 2);
		})
	};

	modalFixView();
	$(window).resize(modalFixView);
}